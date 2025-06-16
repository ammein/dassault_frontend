uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;
uniform int         u_frame;
uniform sampler2D   tex0;
uniform vec2        tex0Resolution;
uniform sampler2D   tex1;
uniform vec2        tex1Resolution;
uniform float       progress;
uniform float       rangeFirst;
uniform float       rangeSecond;
uniform sampler2D   u_scene;

varying vec2        v_texcoord;

#include "lygia/color/tonemap/aces.glsl"
#include "lygia/space/ratio.glsl"
#include "lygia/sampler.glsl"


#define Brightness        .5
#define InColor           vec3(8., 3.2, .0)
#define OutColor          vec3(1., .1, 0.)
#define color_noise       10.
#define burn_noise        .06
#define range1            rangeFirst // 0.06
#define range2            rangeSecond // 0.02
#define alpha_threshold   .09

float NoiseSeed;

float randomFloat(){
    NoiseSeed = sin(NoiseSeed) * 84522.13219145687;
    return fract(NoiseSeed);
}

vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize){
    vec2 tempUV = uv - vec2(0.5);

    float quadAspect = quadSize.x / quadSize.y;
    float textureAspect = textureSize.x / textureSize.y;

    // Simplified One Liner Code
    tempUV = mix(tempUV * vec2(quadAspect/textureAspect, 1.), tempUV * vec2(1., textureAspect/quadAspect), step(textureAspect,quadAspect));

    tempUV += vec2(0.5);
    return tempUV;
}

/********************************************

          XoR - Infinite Value Noise

*********************************************/

float r(in vec2 p)
{
    return fract(cos(p.x*42.98 + p.y*43.23) * 1127.53);
}

float n(in vec2 p)
{
    vec2 fn = floor(p);
    vec2 sn = smoothstep(vec2(0), vec2(1), fract(p));

    float h1 = mix(r(fn), r(fn + vec2(1,0)), sn.x);
    float h2 = mix(r(fn + vec2(0,1)), r(fn + vec2(1)), sn.x);
    return mix(h1 ,h2, sn.y);
}

float noise(in vec2 p)
{
    return n(p/32.) * 0.58 +
    n(p/16.) * 0.2  +
    n(p/8.)  * 0.1  +
    n(p/4.)  * 0.05 +
    n(p/2.)  * 0.02 +
    n(p)     * 0.0125;
}

vec3 background(in vec2 pos)
{
    vec3 color = SAMPLER_FNC(tex1, pos).rgb;

    return color;
}

void main(void) {
    vec2 pixel = 1.0/u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;
    vec2 ratioST = ratio(st, u_resolution.xy);

#ifdef POSTPROCESSING
    NoiseSeed = float(u_frame)* .003186154 + gl_FragCoord.y * 17.2986546543 + gl_FragCoord.x;

    vec2 d = (st-vec2(.5)) * .0075;
    vec3 color = vec3(SAMPLER_FNC(u_scene, st - 0.0 * d).r,
    SAMPLER_FNC(u_scene, st - 1.0 * d).g,
    SAMPLER_FNC(u_scene, st - 2.0 * d).b);

    float noise = Brightness + randomFloat()*.15;
    gl_FragColor = vec4(tonemapACES(color*noise), 1.0);

    // Vignette
    vec2 vignette = abs(st - vec2(0.5)) * 1.6;
    vignette = pow(vignette, vec2(1.2));
    gl_FragColor.rgb *= pow(saturate(1.0 - dot(vignette, vignette)), 2.2);
#else
    // Zoom
    st = st * 2.0 - 1.0;
    st *= 0.9;
    st = (st + 1.0) * 0.5;

    // Lens distortion
    vec2 dir = st - vec2(0.5);
    st += dir * dot(dir, dir) * 0.2;
    vec2 uv1 = getUV(st, tex0Resolution, u_resolution.xy);
    vec2 uv2 = getUV(st, tex1Resolution, u_resolution.xy);

    vec4 origin = SAMPLER_FNC(tex0, uv1);

    vec4 noise_InColor = vec4(noise(color_noise * st) * InColor, 1.) * smoothstep(progress + range1, progress - range1, noise(gl_FragCoord.xy * burn_noise));

    gl_FragColor = origin + noise_InColor;

    vec4 noise_OutColor = vec4(noise(color_noise * st) * OutColor, 1.) * smoothstep(progress + range1 * 6., progress, noise(gl_FragCoord.xy * burn_noise));

    gl_FragColor += noise_OutColor;

    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.), smoothstep(progress + range2, progress - range2, noise(gl_FragCoord.xy * burn_noise)));

    if (gl_FragColor.r <= alpha_threshold && gl_FragColor.g <= alpha_threshold && gl_FragColor.b <= alpha_threshold) {
        gl_FragColor.rgb = background(uv2);
    }
#endif
}
