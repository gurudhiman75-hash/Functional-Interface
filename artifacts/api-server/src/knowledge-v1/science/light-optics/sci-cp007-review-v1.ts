import type { KnowledgeV1Difficulty } from "../../types";

type S = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string];

export type SciCp007ReviewQuestion = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: "SCI-CP-007";
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

const SOURCES = ["NCERT-SCIENCE-VII-LIGHT", "NCERT-SCIENCE-X-LIGHT-REFLECTION-REFRACTION", "NCERT-SCIENCE-X-HUMAN-EYE"] as const;

export const SCI_CP007_QL_NAMES_V1: Record<number,string> = {1:"Laws of reflection",2:"Plane mirrors and lateral inversion",3:"Spherical mirrors and basic image properties",4:"Concave-mirror applications and focal relations",5:"Refraction and refractive index",6:"Lenses, focal length and power",7:"Human eye and vision defects",8:"Dispersion, rainbow and atmospheric scattering",9:"Statement I/II synthesis",10:"Mixed light and optics application"};

const S7: readonly S[] = [
  [1,"Easy","The bouncing back of light from a surface is called:","reflection",["refraction","dispersion","diffraction"],"Reflection is the return of light into the same medium after striking a surface. The incident light remains in the original medium after striking the reflecting surface."],
  [1,"Easy","According to the law of reflection, the angle of incidence is:","equal to the angle of reflection",["half the angle of reflection","double the angle of reflection","always zero"],"For reflection, angle of incidence equals angle of reflection. Both angles are measured from the normal drawn at the point where the ray strikes the surface."],
  [1,"Easy","The incident ray, reflected ray and normal at the point of incidence lie in:","the same plane",["three different planes","a vacuum only","parallel planes only"],"This is the second law of reflection. The coplanar arrangement fixes the geometry of incident ray, reflected ray and normal."],
  [1,"Easy","The angle of incidence is measured between the incident ray and the:","normal",["mirror surface","reflected ray","horizontal line"],"Angles of incidence and reflection are measured from the normal. The normal is an imaginary line perpendicular to the surface at the point of incidence."],
  [1,"Easy","If a ray strikes a plane mirror normally, the angle of reflection is:","0°",["45°","90°","180°"],"At normal incidence, the ray travels along the normal, so both angles are zero. A ray travelling along the normal retraces its path because it strikes the mirror perpendicularly."],
  [1,"Easy","A smooth polished surface produces:","regular reflection",["only refraction","no reflection","random absorption only"],"A smooth surface reflects parallel incident rays in an orderly way. Rough surfaces scatter reflected rays in many directions, producing diffuse rather than regular reflection."],
  [2,"Easy","The image formed by a plane mirror is usually:","virtual and erect",["real and inverted","real and erect","virtual and inverted"],"A plane mirror forms a virtual, erect image. The image cannot be caught on a screen because the reflected rays only appear to come from behind the mirror."],
  [2,"Easy","A plane mirror forms an image that is:","the same size as the object",["always enlarged","always diminished","twice the object size"],"Plane-mirror magnification is 1. Magnification is +1, so image height equals object height."],
  [2,"Easy","The image in a plane mirror appears as far behind the mirror as the object is:","in front of the mirror",["above the mirror","below the mirror","from the observer only"],"Object distance equals image distance for a plane mirror. This symmetry places the virtual image at the same perpendicular distance behind the mirror."],
  [2,"Easy","The left-right reversal seen in a plane mirror is called:","lateral inversion",["dispersion","refraction","total internal reflection"],"Plane mirrors produce lateral inversion. The reversal is apparent left-to-right because front-back direction is reversed by reflection."],
  [2,"Easy","Which mirror is commonly used in a periscope?","plane mirror",["concave mirror only","convex lens","concave lens"],"Simple periscopes use plane mirrors to redirect light. Two mirrors at suitable angles let the observer see over or around an obstacle."],
  [2,"Easy","If you move 1 m toward a plane mirror, the distance between you and your image decreases by:","2 m",["1 m","0.5 m","4 m"],"Both object and image positions move 1 m closer to the mirror, reducing separation by 2 m. The image also shifts 1 m behind the mirror, so total object-image separation changes by 2 m."],
  [3,"Easy","A concave mirror is also called a:","converging mirror",["diverging mirror","plane mirror","refracting mirror"],"A concave mirror can converge parallel rays to a focus. Parallel rays reflected from a concave mirror can meet at its principal focus."],
  [3,"Easy","A convex mirror is also called a:","diverging mirror",["converging mirror","plane mirror","cylindrical lens"],"A convex mirror makes parallel rays diverge. Reflected rays spread outward and appear to come from a virtual focus behind the mirror."],
  [3,"Easy","Which mirror is commonly used as a rear-view mirror in vehicles?","convex mirror",["concave mirror","plane mirror only","parabolic lens"],"A convex mirror gives an erect diminished image and a wide field of view. The diminished image lets the driver see a wider region behind the vehicle."],
  [3,"Easy","Which mirror is used by dentists to obtain an enlarged view of a tooth?","concave mirror",["convex mirror","plane mirror","two plane mirrors"],"A nearby object in a concave mirror can form an enlarged upright virtual image. This enlarged upright image is obtained when the tooth is within the mirror's focal length."],
  [3,"Easy","A convex mirror always forms an image that is:","virtual, erect and diminished",["real and enlarged","real and inverted","virtual and enlarged"],"For real objects, a convex mirror always gives a virtual erect diminished image. The wide field of view comes with the trade-off that objects appear smaller."],
  [3,"Easy","The centre of the reflecting surface of a spherical mirror is called the:","pole",["focus","centre of curvature","principal axis"],"The pole is the geometric centre of the mirror's reflecting surface. The principal axis passes through the pole and centre of curvature."],
  [4,"Medium","For a spherical mirror, the focal length is approximately:","half the radius of curvature",["equal to twice the radius","equal to the diameter","independent of radius"],"For a spherical mirror, f = R/2. The relation is valid for spherical mirrors when paraxial rays are considered."],
  [4,"Medium","An object placed beyond the centre of curvature of a concave mirror forms an image that is:","real, inverted and diminished",["virtual, erect and enlarged","real, erect and enlarged","virtual and diminished"],"Beyond C, a concave mirror forms a real inverted diminished image between F and C. The image forms between the focus and centre of curvature and can be obtained on a screen."],
  [4,"Medium","An object placed between the pole and focus of a concave mirror forms an image that is:","virtual, erect and enlarged",["real, inverted and diminished","real and same size","virtual and diminished"],"Inside the focal length, reflected rays diverge and the image is virtual, erect and enlarged. Because the reflected rays diverge, their backward extensions meet behind the mirror."],
  [4,"Medium","A concave mirror is used in a solar cooker because it can:","concentrate sunlight at its focus",["spread sunlight widely","block all infrared radiation","form only virtual images"],"Parallel sunlight can be converged near the focus of a concave mirror. Concentrating a larger amount of solar radiation into a small region raises the temperature there."],
  [4,"Medium","A shaving mirror is generally concave because, with the face close to it, the mirror gives a:","magnified upright image",["diminished inverted image","same-size real image","diminished upright image"],"When the face is within the focal length, a concave mirror gives a magnified upright virtual image. This setup gives a larger view while keeping the image upright for close objects."],
  [4,"Medium","A spherical mirror has radius of curvature 40 cm. Its focal length has magnitude:","20 cm",["40 cm","80 cm","10 cm"],"Using f = R/2, focal length magnitude = 40/2 = 20 cm. Doubling the focal length gives the radius of curvature, or equivalently f = R/2."],
  [5,"Medium","The bending of light when it passes from one medium to another is called:","refraction",["reflection","dispersion only","polarization only"],"Light changes direction at a boundary when its speed changes. Refraction occurs because light has different speeds in different optical media."],
  [5,"Medium","When light travels from air into glass obliquely, it usually bends:","toward the normal",["away from the normal","without any change in direction always","back into air"],"Glass is optically denser than air, so the ray bends toward the normal. The ray slows in glass and bends toward the normal when entering obliquely."],
  [5,"Medium","When light travels from glass into air obliquely, it usually bends:","away from the normal",["toward the normal","along the normal in every case","back into glass only"],"Moving to an optically rarer medium bends the ray away from the normal. The ray speeds up on entering air and bends away from the normal."],
  [5,"Medium","Refractive index of a medium is related to the speed of light by:","n = c/v",["n = v/c","n = c + v","n = cv"],"Absolute refractive index equals speed of light in vacuum divided by speed in the medium. A higher refractive index means light travels more slowly in that medium."],
  [5,"Medium","A pencil partly immersed in water appears bent due to:","refraction",["reflection only","diffusion","magnetism"],"Light changes direction as it passes from water to air. The eye traces the refracted rays backward, making the submerged part appear shifted from its true position."],
  [5,"Medium","A swimming pool appears shallower than it actually is because of:","refraction of light",["reflection from air only","dispersion only","sound reflection"],"Refraction at the water-air boundary makes the apparent depth smaller. Objects under water appear raised because rays bend away from the normal as they leave the water."],
  [6,"Medium","A convex lens is also called a:","converging lens",["diverging lens","plane mirror","reflecting prism"],"A convex lens converges parallel rays. Parallel rays passing through a convex lens can be brought toward a real focus."],
  [6,"Medium","A concave lens is also called a:","diverging lens",["converging lens","plane glass plate","reflecting lens"],"A concave lens diverges parallel rays. Parallel rays spread after passing through a concave lens and appear to come from a virtual focus."],
  [6,"Medium","A concave lens forms, for a real object, an image that is always:","virtual, erect and diminished",["real and enlarged","real and inverted","virtual and enlarged"],"A concave lens always forms a virtual erect diminished image of a real object. The image lies between the optical centre and focus on the same side as the object."],
  [6,"Medium","The SI unit commonly used for the power of a lens is:","dioptre",["metre","pascal","candela"],"Lens power is measured in dioptres. One dioptre corresponds to a lens with focal length one metre."],
  [6,"Medium","Power of a lens is equal to:","1 divided by focal length in metres",["focal length in metres","square of focal length","radius divided by two"],"P = 1/f when f is measured in metres. Positive power indicates a converging lens, while negative power indicates a diverging lens."],
  [6,"Medium","A convex lens has focal length 0.5 m. Its power is:","+2 D",["-2 D","+0.5 D","-0.5 D"],"P = 1/0.5 = +2 dioptres for a converging lens. The positive sign confirms that the lens is convex and converging."],
  [7,"Medium","The part of the human eye that controls the amount of light entering is the:","iris",["retina","optic nerve","cornea only"],"The iris changes the pupil size and regulates incoming light. By changing pupil diameter, the iris controls how much light reaches the retina."],
  [7,"Medium","The image in a normal human eye is formed on the:","retina",["iris","pupil","optic nerve"],"The eye lens focuses light on the retina. Light-sensitive cells in the retina convert the focused image into electrical nerve signals."],
  [7,"Medium","The ability of the eye lens to change its focal length is called:","accommodation",["dispersion","persistence only","scattering"],"Accommodation lets the eye focus on objects at different distances. Ciliary muscles alter lens curvature so nearby and distant objects can both be focused clearly."],
  [7,"Medium","Myopia is corrected using a:","concave lens",["convex lens","plane mirror","cylindrical mirror only"],"A concave lens diverges incoming rays so a myopic eye can focus distant objects on the retina. The diverging lens reduces excessive convergence so the final image shifts back onto the retina."],
  [7,"Medium","Hypermetropia is corrected using a:","convex lens",["concave lens","plane glass plate","convex mirror"],"A convex lens helps converge rays before they enter a hypermetropic eye. The converging lens adds focusing power so nearby-object rays can be brought onto the retina."],
  [7,"Medium","Presbyopia is related to:","age-related reduction in the eye's power of accommodation",["infection of the retina only","complete absence of iris","excessive tear production"],"With age, the lens becomes less flexible and accommodation decreases. Reduced flexibility makes it harder for the eye to focus on near objects with advancing age."],
  [8,"Medium","The splitting of white light into its component colours is called:","dispersion",["reflection","accommodation","diffusion"],"A prism can separate white light into its spectrum. Different colours bend by different amounts because their refractive indices in glass are slightly different."],
  [8,"Medium","Which colour of visible light is deviated the most by a glass prism?","violet",["red","yellow","orange"],"Violet light has the greater refractive index in glass and is deviated more. Violet light slows and bends more strongly in glass than red light."],
  [8,"Medium","Which colour of visible light is deviated the least by a glass prism?","red",["violet","blue","indigo"],"Red light is refracted less than violet in glass. Red has the smallest refractive index among visible colours in ordinary glass and therefore deviates least."],
  [8,"Medium","A rainbow is formed due to refraction, dispersion and:","internal reflection inside water droplets",["magnetic induction","sound interference","electric conduction"],"Sunlight is refracted and dispersed, reflected inside droplets, and refracted again. Each droplet acts like a tiny prism and reflector, separating sunlight into different colours."],
  [8,"Medium","The blue colour of the clear daytime sky is due to:","scattering of shorter wavelengths of sunlight",["reflection from oceans","absorption of all blue light","dispersion by large mirrors"],"Shorter wavelengths such as blue are scattered more strongly by the atmosphere. Shorter wavelengths are scattered more efficiently by small molecules in the atmosphere."],
  [8,"Medium","The Sun appears reddish near sunrise and sunset because:","shorter wavelengths are scattered out of the direct path",["red light travels faster in vacuum","the Sun becomes cooler","the atmosphere produces red light"],"The long atmospheric path scatters much of the shorter-wavelength light, leaving more red light to reach the eye directly. During the long path through the atmosphere, much blue light is scattered away before sunlight reaches the observer."],
  [9,"Hard","Consider the statements:\nI. A plane mirror forms a virtual erect image.\nII. The image is the same size as the object.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Both are standard properties of a plane-mirror image. Equal image size, upright orientation and virtual nature are characteristic properties of a plane mirror."],
  [9,"Hard","Consider the statements:\nI. A convex mirror gives a wider field of view than a plane mirror.\nII. It forms a virtual erect diminished image for a real object.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Both properties make convex mirrors useful as rear-view mirrors. These two properties together make convex mirrors particularly useful for vehicle rear-view applications."],
  [9,"Hard","Consider the statements:\nI. Light bends toward the normal when entering glass from air obliquely.\nII. It bends because its speed changes between the two media.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Refraction results from the change in speed of light at the boundary. The change in speed at the boundary causes the direction change described by refraction."],
  [9,"Hard","Consider the statements:\nI. A concave lens is a diverging lens.\nII. It can form a real inverted image of a real object by itself.\nWhich is correct?","I only",["II only","Both I and II","Neither I nor II"],"A concave lens is diverging and forms a virtual erect diminished image for a real object. A single concave lens cannot converge rays from a real object to form a real image."],
  [9,"Hard","Consider the statements:\nI. Myopia is corrected with a concave lens.\nII. Hypermetropia is corrected with a convex lens.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"The two common vision defects use diverging and converging corrective lenses respectively. The corrective lenses compensate for opposite focusing errors in the two vision defects."],
  [9,"Hard","Consider the statements:\nI. Violet light deviates more than red in a glass prism.\nII. Red light is scattered more strongly than blue light in the atmosphere.\nWhich is correct?","I only",["II only","Both I and II","Neither I nor II"],"Violet deviates more in a prism, while shorter wavelengths such as blue are scattered more strongly than red. Atmospheric scattering is stronger for shorter wavelengths, so blue is scattered more strongly than red."],
  [10,"Hard","A lens has power -4 D. Its focal length is:","-0.25 m",["+0.25 m","-4 m","+4 m"],"f = 1/P = 1/(-4) = -0.25 m. Using f = 1/P gives a negative focal length, identifying a diverging lens."],
  [10,"Hard","A convex lens has power +5 D. Its focal length is:","0.20 m",["5 m","0.05 m","-0.20 m"],"f = 1/P = 1/5 = 0.20 m. Taking the reciprocal of +5 dioptres gives a positive focal length of 0.20 metre."],
  [10,"Hard","A plane mirror is moved 2 m farther away from a stationary object. The distance between the object and its image increases by:","4 m",["2 m","1 m","8 m"],"The image stays equally far behind the mirror, so a 2 m mirror shift increases object-image separation by 4 m. Both object-to-mirror and mirror-to-image distances increase by 2 m, giving a total increase of 4 m."],
  [10,"Hard","A spherical mirror has focal length magnitude 15 cm. Its radius of curvature has magnitude:","30 cm",["7.5 cm","15 cm","45 cm"],"R = 2f, so the radius magnitude is 30 cm. Radius of curvature is twice the focal length for a spherical mirror."],
  [10,"Hard","A ray enters glass from air along the normal. It will:","continue without bending",["bend toward the normal","bend away from the normal","be totally reflected"],"At normal incidence the direction does not change, although the speed changes. Only the speed and wavelength change at normal incidence; the ray direction remains unchanged."],
  [10,"Hard","A student replaces a vehicle's convex rear-view mirror with a plane mirror of similar size. The main disadvantage is that the driver will see:","a smaller field of view",["an upside-down image","no image at all","a much wider field of view"],"A convex mirror covers a wider field than a similar-sized plane mirror. A plane mirror of the same size shows less surrounding area than a convex mirror."]
];

export function generateSciCp007ReviewBatchV1(): SciCp007ReviewQuestion[] {
  return S7.map((s,i) => {
    const [ql,difficulty,stem,answer,distractors,explanation] = s;
    const base = [answer,...distractors];
    const shift = i % 4;
    const options = [...base.slice(shift),...base.slice(0,shift)];
    const correctIndex = options.indexOf(answer);
    return {
      questionId: `SCI-CP007-V1-${String(i+1).padStart(3,"0")}`,
      chapterId: "SCI-001",
      cpId: "SCI-CP-007",
      qlId: `SCI-CP007-QL-${String(ql).padStart(2,"0")}`,
      qlName: SCI_CP007_QL_NAMES_V1[ql],
      difficulty,
      stem,
      options,
      correctIndex,
      canonicalAnswer: answer,
      explanation,
      sourceIds: [...SOURCES],
      sourceFactIds: [`SCI-CP007-QL-${String(ql).padStart(2,"0")}-FACT-${String((i%6)+1).padStart(2,"0")}`],
      reviewOnly: true,
      runtimeRegistered: false
    };
  });
}
