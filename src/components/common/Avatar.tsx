import { VerifiedBadge } from './VerifiedBadge'

const tones={navy:{backgroundColor:'#14213D',color:'#fff'},indigo:{backgroundColor:'#3F4FA0',color:'#fff'},violet:{backgroundColor:'#7C5CBF',color:'#fff'},sky:{backgroundColor:'#5BA4E6',color:'#fff'},coral:{backgroundColor:'#F2705A',color:'#fff'},amber:{backgroundColor:'#F5B544',color:'#14213D'},'amber-tint':{backgroundColor:'#FEF3D8',color:'#8A5A00'},'indigo-tint':{backgroundColor:'#EEF0FA',color:'#3F4FA0'}}
export type AvatarTone=keyof typeof tones
export function Avatar({name,size=48,tone='indigo',verified=false}:{name:string;size?:number;tone?:AvatarTone;verified?:boolean}){const initials=name.trim().split(/\s+/).slice(0,2).map(part=>part[0]??'').join('').toUpperCase();return <span className="relative inline-grid shrink-0 place-items-center rounded-full font-bold" style={{...tones[tone],width:size,height:size,fontSize:size<40?size*.32:size*.34}}>{initials}{verified&&<VerifiedBadge/>}</span>}
