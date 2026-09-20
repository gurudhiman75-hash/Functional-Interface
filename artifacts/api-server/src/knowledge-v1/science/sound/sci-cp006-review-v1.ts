import type { KnowledgeV1Difficulty } from "../../types";

type S = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string];

export type SciCp006ReviewQuestion = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: "SCI-CP-006";
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

const SOURCES = ["NCERT-SCIENCE-VIII-SOUND", "NCERT-SCIENCE-IX-SOUND"] as const;

export const SCI_CP006_QL_NAMES_V1: Record<number,string> = {1:"Sound production and vibrating sources",2:"Propagation, media, compressions and rarefactions",3:"Frequency, amplitude, pitch and loudness",4:"Time period, wavelength and wave-speed relation",5:"Audible, infrasonic and ultrasonic sound",6:"Echo, reflection and SONAR",7:"Human ear and hearing",8:"Noise pollution and reverberation",9:"Statement I/II synthesis",10:"Mixed sound application and calculation"};

const S6: readonly S[] = [
  [1,"Easy","Sound is produced by an object when it:","vibrates",["melts","evaporates","becomes electrically charged"],"Sound is produced by vibrating objects. The vibration disturbs nearby particles and creates a travelling pressure wave in the surrounding medium."],
  [1,"Easy","Which part of a tuning fork produces sound?","its vibrating prongs",["its handle only","the air inside the handle","its base without vibration"],"The prongs vibrate rapidly and set the surrounding air into vibration. The moving prongs repeatedly push and pull nearby air, producing compressions and rarefactions."],
  [1,"Easy","When a stretched guitar string is plucked, sound is produced because the string:","vibrates",["becomes hotter","loses mass","changes colour"],"The plucked string vibrates and produces sound waves. The vibrating string transfers energy to the surrounding air and creates audible sound waves."],
  [1,"Easy","The human voice is produced by vibrations of the:","vocal cords",["tongue","teeth","lungs"],"Air from the lungs makes the vocal cords vibrate. The vocal cords are located in the larynx and vibrate as air passes between them."],
  [1,"Easy","Which statement about sound production is correct?","a vibrating source can produce sound",["sound is produced only by heating","sound needs no vibrating source","only metals can produce sound"],"Vibration of a source is the basic cause of sound. Different sources vibrate in different ways, but vibration is the common starting point for sound production."],
  [1,"Easy","If a ringing bell is touched so that its vibration stops, the sound soon:","stops",["becomes louder","becomes higher in pitch","travels faster"],"Stopping the vibration removes the source of the sound. Once the source stops vibrating, it can no longer maintain the sound wave."],
  [2,"Easy","Sound travels through a medium as a:","mechanical wave",["beam of particles from the source","stream of electric current","magnetic field only"],"Sound is a mechanical wave and needs a material medium. The medium's particles vibrate about their positions and pass the disturbance from one region to the next."],
  [2,"Easy","Sound cannot travel through:","vacuum",["air","water","steel"],"Sound needs particles of a medium, so it cannot travel through vacuum. A vacuum contains no particles to transfer the mechanical disturbance from the source onward."],
  [2,"Easy","In air, sound is transmitted through successive:","compressions and rarefactions",["reflections and refractions only","electric charges","magnetic poles"],"Air particles form alternating compressions and rarefactions. These alternating high-pressure and low-pressure regions make sound in air a longitudinal wave."],
  [2,"Easy","Which medium generally carries sound fastest?","solids",["gases","vacuum","empty space"],"Particles are closely packed in solids, so sound usually travels fastest there. Stronger elastic interactions between closely spaced particles allow vibrations to pass rapidly through many solids."],
  [2,"Easy","Astronauts on the Moon cannot talk directly through open air because the Moon has essentially:","no atmosphere to carry sound",["too much oxygen","too much water vapour","very strong magnetic fields"],"Without a material medium, ordinary sound cannot propagate. Radio communication is needed in such conditions because ordinary sound has no medium through which to travel."],
  [2,"Easy","Which property shows that sound is a mechanical wave?","it needs a material medium to travel",["it travels through vacuum","it has no frequency","it always moves at light speed"],"Mechanical waves require a material medium. This dependence on matter distinguishes sound from electromagnetic waves such as light."],
  [3,"Easy","The number of vibrations made in one second is called:","frequency",["amplitude","wavelength","loudness"],"Frequency is the number of oscillations per second. One hertz means one complete vibration or cycle occurs each second."],
  [3,"Easy","The SI unit of frequency is:","hertz (Hz)",["decibel (dB)","metre (m)","second (s)"],"Frequency is measured in hertz. A source vibrating 200 times each second therefore has a frequency of 200 Hz."],
  [3,"Easy","A sound with a higher frequency is generally heard as:","higher pitch",["greater loudness only","lower pitch","slower sound"],"Pitch depends on frequency. Pitch is the hearing sensation that lets us distinguish higher-frequency sounds from lower-frequency sounds."],
  [3,"Easy","Loudness of a sound is most closely related to the wave's:","amplitude",["frequency only","speed only","wavelength only"],"Greater amplitude generally means a louder sound. Amplitude represents the size of the vibration and is closely linked with the energy carried by the sound."],
  [3,"Easy","A soft sound has, compared with a loud sound, generally:","smaller amplitude",["higher speed","greater frequency in every case","larger wavelength in every case"],"Soft sounds are linked to smaller amplitudes. Reducing amplitude lowers sound intensity without necessarily changing its pitch."],
  [3,"Easy","If the frequency of a sound doubles while other factors are unchanged, its perceived pitch generally:","increases",["decreases","becomes zero","depends only on amplitude"],"Higher frequency corresponds to higher pitch. If amplitude stays unchanged, increasing frequency changes pitch rather than loudness."],
  [4,"Medium","The time taken for one complete vibration is called the:","time period",["frequency","amplitude","echo"],"Time period is the duration of one complete oscillation. It is measured in seconds and is the reciprocal of frequency."],
  [4,"Medium","Frequency and time period are related by:","f = 1/T",["f = T","f = T²","f = 2T"],"Frequency is the reciprocal of time period. This means a high-frequency vibration has a shorter time period."],
  [4,"Medium","A source makes 200 vibrations in 2 seconds. Its frequency is:","100 Hz",["400 Hz","202 Hz","0.01 Hz"],"Frequency = number of vibrations ÷ time = 200 ÷ 2 = 100 Hz. Dividing the total number of vibrations by the elapsed time gives vibrations per second."],
  [4,"Medium","A sound wave of frequency 50 Hz has a time period of:","0.02 s",["2 s","50 s","0.5 s"],"T = 1/f = 1/50 = 0.02 s. A 50 Hz source completes one cycle every 0.02 second."],
  [4,"Medium","If frequency increases while wave speed remains constant, wavelength:","decreases",["increases","remains unchanged","becomes zero"],"Using v = fλ, higher f at fixed v means smaller λ. The relation shows that frequency and wavelength vary inversely when wave speed is fixed."],
  [4,"Medium","For a wave, speed, frequency and wavelength are related by:","v = fλ",["v = f/λ","v = λ/f","v = f + λ"],"Wave speed equals frequency multiplied by wavelength. This equation applies to sound and many other waves when the correct wave speed is used."],
  [5,"Medium","The approximate audible frequency range for a healthy young human is:","20 Hz to 20,000 Hz",["2 Hz to 200 Hz","200 Hz to 2,000 Hz","20,000 Hz to 200,000 Hz"],"Humans generally hear frequencies from about 20 Hz to 20 kHz. Frequencies outside this approximate range are not normally heard by young healthy humans."],
  [5,"Medium","Sound with frequency below 20 Hz is called:","infrasonic",["ultrasonic","supersonic","audible"],"Infrasonic sound lies below the lower limit of human hearing. Very low-frequency infrasound can be produced by sources such as earthquakes and large machinery."],
  [5,"Medium","Sound with frequency above 20,000 Hz is called:","ultrasonic",["infrasonic","audible","subsonic"],"Ultrasound has frequency above about 20 kHz. Ultrasound is used in imaging, cleaning and distance measurement because of its short wavelength and directionality."],
  [5,"Medium","Which animal is well known for using ultrasound for echolocation?","bat",["cow","goat","horse"],"Bats emit and detect ultrasonic waves for navigation and hunting. Echoes from emitted ultrasound help bats estimate the position and motion of nearby objects."],
  [5,"Medium","Dogs can hear some sounds that humans cannot because dogs can detect:","higher frequencies",["only lower amplitudes","sound in vacuum","light waves as sound"],"Dogs can hear frequencies above the usual human upper limit. The upper hearing limit differs between species, allowing dogs to detect frequencies beyond normal human hearing."],
  [5,"Medium","Which is an application of ultrasound?","medical imaging",["measuring electric current","producing static charge","measuring atmospheric pressure"],"Ultrasound is used in diagnostic imaging of internal body structures. Ultrasound can form images because reflected waves from tissue boundaries are detected and processed."],
  [6,"Medium","An echo is produced due to:","reflection of sound",["refraction of light","absorption of sound only","production of ultrasound only"],"An echo is a reflected sound heard separately from the original. The reflected wave follows the same medium back toward the listener after striking a suitable surface."],
  [6,"Medium","For a distinct echo in air, the reflected sound should usually reach the ear after at least about:","0.1 s",["0.001 s","1 microsecond","10 s"],"The persistence of hearing is about 0.1 s, so a later reflection may be heard separately. A shorter delay merges with the original sound because the ear cannot separate the two sensations clearly."],
  [6,"Medium","If the speed of sound is 340 m/s, the minimum one-way distance of a reflecting wall for an echo after 0.1 s is about:","17 m",["34 m","170 m","3.4 m"],"Sound travels to the wall and back: distance = 340 × 0.1 = 34 m, so one-way distance is 17 m. The measured 0.1 second is for the complete journey to the wall and back."],
  [6,"Medium","Multiple reflections of sound are used in a:","megaphone",["barometer","hydrometer","galvanometer"],"Megaphones guide sound by repeated reflection inside their shape. The shape helps direct more sound energy toward the listener instead of allowing it to spread widely."],
  [6,"Medium","SONAR works by sending sound waves and measuring their:","echoes",["electric charge","magnetic poles","colour change"],"SONAR uses reflected sound, usually ultrasound, to determine distance or depth. Travel time of the reflected pulse, together with sound speed, gives the distance to the reflecting object."],
  [6,"Medium","A ship sends a sonar pulse downward and receives the echo after 2 s. If sound speed in water is 1500 m/s, the depth is:","1500 m",["3000 m","750 m","150 m"],"Round-trip distance = 1500 × 2 = 3000 m, so depth = 1500 m. The pulse covers the depth twice, once downward and once upward, so the total distance is divided by two."],
  [7,"Medium","The part of the human ear that vibrates when sound waves enter is the:","eardrum",["retina","cornea","optic nerve"],"Sound waves make the eardrum vibrate. The eardrum converts pressure variations in the incoming sound into mechanical vibrations."],
  [7,"Medium","The three tiny bones of the middle ear help to:","transmit and amplify vibrations",["produce light","filter blood","control body temperature"],"The ossicles transmit eardrum vibrations to the inner ear. These bones—the malleus, incus and stapes—carry vibrations toward the inner ear."],
  [7,"Medium","The cochlea is located in the:","inner ear",["outer ear only","middle ear only","throat"],"The cochlea is a spiral-shaped structure of the inner ear. Inside the cochlea, sensory hair cells convert mechanical vibrations into nerve signals."],
  [7,"Medium","The auditory nerve carries signals from the ear to the:","brain",["heart","lungs","kidneys"],"The auditory nerve sends hearing information to the brain. The brain interprets these signals as sounds with particular pitch, loudness and other qualities."],
  [7,"Medium","Prolonged exposure to very loud sound can damage:","hearing",["only eyesight","only skin colour","blood group"],"Very loud sounds can damage sensitive structures of the ear. Repeated intense sound exposure can injure inner-ear hair cells and cause permanent hearing loss."],
  [7,"Medium","Which unit is commonly used to express sound level?","decibel (dB)",["hertz (Hz)","pascal-second","tesla"],"Sound level is commonly expressed in decibels. The decibel scale is logarithmic, so equal numerical increases represent multiplicative changes in sound intensity."],
  [8,"Medium","Noise is best described as:","unwanted or unpleasant sound",["all low-frequency sound","all high-frequency sound","sound that travels in vacuum"],"Noise is unwanted sound that may cause discomfort or harm. Whether a sound is considered noise depends on context, intensity and its effect on people."],
  [8,"Medium","Which measure can reduce noise pollution near busy roads?","using sound barriers and limiting unnecessary horns",["increasing horn use","removing silencers","using louder loudspeakers"],"Barriers and reduced horn use can lower environmental noise. Both approaches reduce the amount of unwanted sound reaching nearby homes and pedestrians."],
  [8,"Medium","A hospital area is often declared a silence zone to:","reduce disturbance from excessive noise",["increase echo","increase sound frequency","make sound travel faster"],"Lower noise helps protect patients and maintain a calm environment. Reducing unnecessary sound is especially important where patients need rest and recovery."],
  [8,"Medium","Why are soft materials such as curtains used in auditoriums?","they absorb sound and reduce excessive reverberation",["they increase all echoes","they produce ultrasound","they increase sound speed"],"Soft porous materials absorb part of the sound. Absorption reduces the energy available for repeated reflections, making speech clearer."],
  [8,"Medium","Reverberation is the persistence of sound in a hall due to:","repeated reflections",["complete absence of reflection","sound travelling in vacuum","only changes in pitch"],"Repeated reflections make sound continue briefly after the source stops. Too much reverberation makes successive sounds overlap and can reduce speech intelligibility."],
  [8,"Medium","Which change is most useful for reducing excessive reverberation in a hall?","adding sound-absorbing materials",["adding more hard bare walls","removing curtains","increasing loudspeaker volume"],"Absorbing surfaces reduce repeated reflections. Carpets, curtains, acoustic panels and upholstered surfaces are commonly used for this purpose."],
  [9,"Hard","Consider the statements:\nI. Pitch depends on frequency.\nII. Loudness depends on amplitude.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Pitch is linked with frequency, while loudness is linked with amplitude. Frequency and amplitude describe different wave properties, so they affect pitch and loudness differently."],
  [9,"Hard","Consider the statements:\nI. Sound can travel through vacuum.\nII. Sound generally travels faster in solids than in gases.\nWhich is correct?","II only",["I only","Both I and II","Neither I nor II"],"Sound needs a medium and generally travels faster in solids. Without particles there is no mechanical pathway for sound, while tightly coupled solids often transmit it quickly."],
  [9,"Hard","Consider the statements:\nI. Ultrasound has frequency above 20 kHz.\nII. Infrasound has frequency below 20 Hz.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Both frequency ranges are correctly stated. These limits divide sound into infrasonic, audible and ultrasonic frequency regions."],
  [9,"Hard","Consider the statements:\nI. Echo is caused by reflection of sound.\nII. SONAR can use reflected ultrasound to determine depth.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Both statements describe applications of sound reflection. Both cases use the same physical principle: sound reflects from a surface and returns as an echo."],
  [9,"Hard","Consider the statements:\nI. Frequency and time period are reciprocals.\nII. Doubling frequency doubles time period.\nWhich is correct?","I only",["II only","Both I and II","Neither I nor II"],"T = 1/f, so doubling frequency halves time period. Because fT = 1, changing one quantity causes the other to change in the opposite direction."],
  [9,"Hard","Consider the statements:\nI. Curtains can reduce reverberation.\nII. Hard bare walls usually absorb more sound than soft porous materials.\nWhich is correct?","I only",["II only","Both I and II","Neither I nor II"],"Soft porous materials absorb more sound than hard bare walls. Hard surfaces reflect more sound, while soft porous materials absorb more acoustic energy."],
  [10,"Hard","A wave has frequency 500 Hz and wavelength 0.68 m. Its speed is:","340 m/s",["735 m/s","500 m/s","0.00136 m/s"],"v = fλ = 500 × 0.68 = 340 m/s. Multiplying frequency by wavelength gives the distance the wave travels each second."],
  [10,"Hard","A sound wave travels at 330 m/s with frequency 110 Hz. Its wavelength is:","3 m",["0.33 m","30 m","440 m"],"λ = v/f = 330/110 = 3 m. Dividing 330 m/s by 110 cycles per second gives a wavelength of 3 metres."],
  [10,"Hard","Two sounds have the same frequency but different amplitudes. They differ in:","loudness",["pitch","speed in the same medium","frequency"],"Same frequency means same pitch; different amplitude changes loudness. Amplitude changes the sound's strength, but equal frequency keeps the perceived pitch the same."],
  [10,"Hard","Two sounds travel through the same air. One has twice the frequency of the other. If their speeds are equal, the higher-frequency sound has:","half the wavelength",["double the wavelength","the same wavelength","four times the wavelength"],"Since v = fλ, doubling f halves λ at constant v. At the same wave speed, twice as many cycles per second means each wavelength must be half as long."],
  [10,"Hard","A person hears a reflected sound 0.2 s after making a clap. If sound speed is 340 m/s, the reflecting surface is about:","34 m away",["68 m away","17 m away","340 m away"],"Round-trip distance = 340 × 0.2 = 68 m, so one-way distance is 34 m. Again, the measured time is for the outward and return journey, so the one-way distance is half."],
  [10,"Hard","A source makes 600 vibrations in 3 seconds. If sound speed is 400 m/s, its wavelength is:","2 m",["200 m","0.5 m","1200 m"],"Frequency = 600/3 = 200 Hz; wavelength = 400/200 = 2 m. The two-step calculation first finds frequency, then uses λ = v/f to obtain the wavelength."]
];

export function generateSciCp006ReviewBatchV1(): SciCp006ReviewQuestion[] {
  return S6.map((s,i) => {
    const [ql,difficulty,stem,answer,distractors,explanation] = s;
    const base = [answer,...distractors];
    const shift = i % 4;
    const options = [...base.slice(shift),...base.slice(0,shift)];
    const correctIndex = options.indexOf(answer);
    return {
      questionId: `SCI-CP006-V1-${String(i+1).padStart(3,"0")}`,
      chapterId: "SCI-001",
      cpId: "SCI-CP-006",
      qlId: `SCI-CP006-QL-${String(ql).padStart(2,"0")}`,
      qlName: SCI_CP006_QL_NAMES_V1[ql],
      difficulty,
      stem,
      options,
      correctIndex,
      canonicalAnswer: answer,
      explanation,
      sourceIds: [...SOURCES],
      sourceFactIds: [`SCI-CP006-QL-${String(ql).padStart(2,"0")}-FACT-${String((i%6)+1).padStart(2,"0")}`],
      reviewOnly: true,
      runtimeRegistered: false
    };
  });
}
