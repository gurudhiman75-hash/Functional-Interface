import type { TmwCp010CommonTrap, TmwCp010Option } from './cp010-types';
function letter(index:number){return 'ABCD'[index]??String(index+1);}
function reason(id:TmwCp010Option['misconceptionId']):string{switch(id){
 case'PRE_EVENT_STAGE_IGNORED':return 'results from applying only the final arrangement and ignoring the level changes accumulated in earlier intervals.';
 case'POST_EVENT_STAGE_IGNORED':return 'uses only the first stage and ignores the rate change after the event.';
 case'EVENT_TIME_ADDED_TWICE':return 'counts the known delay or timing adjustment twice when combining stage times.';
 case'PIPE_SIGN_IGNORED':return 'treats an outlet or leak as positive inflow instead of applying its negative sign.';
 case'INITIAL_LEVEL_IGNORED':return 'solves for a whole tank instead of starting from the stated partial level.';
 case'IDLE_INTERVAL_IGNORED':return 'omits the zero-flow interruption from total elapsed time.';
 case'THRESHOLD_SWITCH_IGNORED':return 'uses one constant rate for the entire journey and ignores the level-triggered switch.';
 case'CYCLE_ORDER_REVERSED':return 'applies the repeating segments in the wrong order or starts from segment 1 when another phase is specified.';
 case'ONE_FULL_CYCLE_TOO_MANY':return 'uses one extra complete cycle even though the tank reaches the boundary during the terminal cycle.';
 case'ONE_FULL_CYCLE_TOO_FEW':return 'stops one complete cycle too early before checking the remaining segments.';
 case'TERMINAL_FRACTION_IGNORED':return 'reports only complete-cycle time and omits the fractional terminal segment.';
 case'WRONG_TERMINAL_SEGMENT':return 'identifies the next or previous cycle segment instead of testing the tank level after each segment.';
 case'BOUNDARY_TIME_NOT_CHECKED':return 'does not replay the schedule up to the first full or empty event.';
 case'PHYSICAL_STAGE_OMITTED':return 'leaves out one net-flow stage when adding the physical volume delivered.';
 case'PHYSICAL_DURATION_IGNORED':return 'adds hourly flow figures without multiplying each flow by its operating duration.';
 case'INVERSE_STAGE_NOT_ISOLATED':return 'substitutes a known time or rate without isolating the unknown event variable.';
 case'STAGE_DURATION_COMPLEMENT_USED':return 'reports the second-stage duration, T − x, instead of the first-stage event time x.';
 case'ORIGINAL_EVENT_TIME_REPORTED':return 'reports the original planned change time instead of the amount by which it must be shifted.';
 case'COMPLEMENT_LEVEL_REPORTED':return 'reports the empty fraction, 1 − L, instead of the fraction of the tank that is full.';
 case'CONTROL_CYCLE_COUNT_IGNORED':return 'calculates one upper-to-lower-to-upper control cycle but does not multiply by the required number of returns.';
 case'RATE_TIME_RECIPROCAL_ERROR':return 'uses a completion time as a rate or takes the reciprocal at the wrong stage.';
 case'PLAUSIBLE_SCALE_ERROR':return 'is numerically close but does not satisfy the exact stage or cycle ledger.';
 case'CORRECT':return '';
 }}
export function tmwCp010CommonTrap(options:TmwCp010Option[],correctIndex:number):TmwCp010CommonTrap{const chosen=options.map((option,index)=>({option,index})).find(item=>item.index!==correctIndex&&item.option.misconceptionId!=='PLAUSIBLE_SCALE_ERROR')??options.map((option,index)=>({option,index})).find(item=>item.index!==correctIndex);if(!chosen||chosen.option.misconceptionId==='CORRECT')throw new Error('No distractor');const optionLabel=`Option ${letter(chosen.index)}`;return{optionLabel,optionText:chosen.option.text,misconceptionId:chosen.option.misconceptionId,explanation:`${optionLabel} (${chosen.option.text}) ${reason(chosen.option.misconceptionId)}`};}
