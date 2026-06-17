// ============================================================
// NEURO DIAGNOSTICS UNIT — CASE DATA
// Each case: patient report, interview questions (with evidence
// unlocks), correct neurotransmitter + direction, distractor
// feedback, and teaching explanation.
// ============================================================

const NEUROTRANSMITTERS = [
  { id: "ach", name: "Acetylcholine" },
  { id: "da",  name: "Dopamine" },
  { id: "5ht", name: "Serotonin" },
  { id: "ne",  name: "Noradrenaline" },
  { id: "gaba", name: "GABA" },
  { id: "glu", name: "Glutamate" }
];

const NT_PRIMER = [
  { id: "ach", name: "Acetylcholine", role: "Neuromuscular junction signalling, memory circuits (hippocampus), and the parasympathetic \"rest & digest\" system." },
  { id: "da",  name: "Dopamine", role: "Movement initiation (substantia nigra → striatum), reward/motivation circuits, and prefrontal cognition." },
  { id: "5ht", name: "Serotonin", role: "Mood regulation, sleep-wake cycles, appetite, and gut motility." },
  { id: "ne",  name: "Noradrenaline", role: "Sympathetic \"fight or flight\" arousal, vigilance, and stress response." },
  { id: "gaba", name: "GABA", role: "Main inhibitory transmitter in the CNS — dampens neural excitability." },
  { id: "glu", name: "Glutamate", role: "Main excitatory transmitter in the CNS — drives synaptic firing and plasticity." }
];

// Helper used by app.js to label directions
const DIRECTION_LABEL = { low: "Deficiency", high: "Excess" };

const CASES = [

// ---------------------------------------------------------------
// CASE 1 — Acetylcholine DEFICIENCY (Alzheimer's-pattern)
// ---------------------------------------------------------------
{
  id: 1,
  tab: "CASE 01",
  patientName: "Mr. Eldon Voss, 74",
  complaint: "Brought in by his daughter after repeatedly forgetting recent conversations and getting lost driving to a store he's visited for 20 years. Long-term childhood memories remain sharp.",
  vitals: [
    ["Heart rate", "78 bpm", false],
    ["Blood pressure", "128/82", false],
    ["Tremor at rest", "Absent", false],
    ["MMSE cognitive score", "21/30 (mild-moderate impairment)", true],
    ["Muscle strength", "Normal", false]
  ],
  correctNT: "ach",
  correctDirection: "low",
  questions: [
    { q: "What's the main problem you've noticed?", a: "\"I just... lose the thread. My daughter told me something an hour ago and it's gone. But I remember my wedding day like it was yesterday.\"", unlocks: "memory-pattern" },
    { q: "Any trouble moving or with tremors?", a: "\"No, my hands are steady. I can still tie my shoes fine. It's not my body, it's my head.\"", unlocks: "no-motor" },
    { q: "Is he taking any medication?", a: "His daughter says: \"The neurologist just started him on donepezil last month.\"", unlocks: "donepezil" },
    { q: "Any family history?", a: "\"His mother had something similar in her seventies. They called it 'hardening of the arteries' back then, but looking back, I think it was the same thing.\"", unlocks: "family-history" },
    { q: "How is his mood and motivation?", a: "\"He's not sad, really. Just frustrated with himself when he forgets things. He still wants to go to his bowling league.\"", unlocks: "mood-normal" }
  ],
  evidence: [
    { id: "memory-pattern", label: "Memory pattern", text: "Short-term/recent memory loss; long-term memory intact." },
    { id: "no-motor", label: "Motor exam", text: "No tremor, no rigidity, normal strength." },
    { id: "donepezil", label: "Prescription", text: "Donepezil — an acetylcholinesterase inhibitor." },
    { id: "family-history", label: "Family history", text: "Mother had similar cognitive decline pattern." },
    { id: "mood-normal", label: "Mood/affect", text: "No depressive symptoms; frustration, not despair." }
  ],
  explanation: {
    correctSummary: "This is classic acetylcholine deficiency, consistent with Alzheimer's disease. ACh-producing neurons in the basal forebrain (which project to the hippocampus) degenerate early in Alzheimer's, which is exactly why short-term memory formation fails while older, already-consolidated memories survive longer.",
    keyClues: [
      "The selective short-term memory loss (not global confusion) points to a hippocampal circuit problem rather than diffuse brain dysfunction — and ACh is the key transmitter for memory encoding in that circuit.",
      "Donepezil is the giveaway clue: it's an acetylcholinesterase inhibitor, meaning it blocks the enzyme that breaks down ACh. Doctors only prescribe this to boost ACh levels — which only makes sense if ACh is the thing that's deficient.",
      "Normal motor exam rules out dopamine pathway involvement (no tremor/rigidity), and intact mood rules out a primary serotonin problem."
    ],
    distractorNote: "Students often guess dopamine here because they associate 'neurodegenerative disease' with Parkinson's. The key differentiator is the symptom domain: dopamine loss in the substantia nigra produces a movement disorder, while ACh loss in the basal forebrain produces a memory disorder. Same broad category (neurodegeneration), different circuit, different transmitter."
  }
},

// ---------------------------------------------------------------
// CASE 2 — Acetylcholine EXCESS (organophosphate poisoning)
// ---------------------------------------------------------------
{
  id: 2,
  tab: "CASE 02",
  patientName: "Farmworker, name withheld, 38",
  complaint: "Collapsed in a field 40 minutes after handling pesticide without gloves. Found drenched in sweat, drooling, with constricted pupils.",
  vitals: [
    ["Heart rate", "48 bpm (bradycardic)", true],
    ["Pupils", "Pinpoint, constricted (miosis)", true],
    ["Salivation/sweating", "Profuse", true],
    ["Muscle activity", "Twitching, then weakness", true],
    ["Respiratory rate", "Labored, increased secretions", true]
  ],
  correctNT: "ach",
  correctDirection: "high",
  questions: [
    { q: "What was the patient doing before collapse?", a: "Coworker says: \"He was spraying the east field with the usual stuff, no mask, no gloves. We told him to be careful with that organophosphate spray.\"", unlocks: "exposure" },
    { q: "Describe the breathing and secretions.", a: "\"He's drooling like crazy, sweating right through his shirt, and his chest sounds wet — like he can't clear it.\"", unlocks: "secretions" },
    { q: "Any muscle symptoms?", a: "\"His arms were twitching at first, almost like little spasms, but now they just look weak and floppy.\"", unlocks: "muscle-twitch" },
    { q: "What do the pupils look like?", a: "Paramedic notes: \"Pupils are pinpoint — barely visible even with a penlight.\"", unlocks: "pupils" },
    { q: "Has anything been given so far?", a: "\"En route, paramedics gave atropine. His heart rate's come up a bit since.\"", unlocks: "atropine" }
  ],
  evidence: [
    { id: "exposure", label: "Exposure history", text: "Direct organophosphate pesticide exposure, no protective equipment." },
    { id: "secretions", label: "Secretions", text: "Excess salivation, sweating, bronchial secretions (\"SLUDGE\" pattern)." },
    { id: "muscle-twitch", label: "Muscle exam", text: "Fasciculations progressing to weakness." },
    { id: "pupils", label: "Pupil exam", text: "Miosis (pinpoint pupils)." },
    { id: "atropine", label: "Treatment response", text: "Atropine (a muscarinic ACh receptor blocker) improved heart rate." }
  ],
  explanation: {
    correctSummary: "This is acetylcholine excess from organophosphate poisoning. Organophosphates inhibit acetylcholinesterase — the enzyme that normally breaks ACh down at the synapse — so ACh builds up unchecked at both muscarinic and nicotinic receptors throughout the body.",
    keyClues: [
      "The exposure history is the strongest single clue: organophosphates are a textbook acetylcholinesterase inhibitor, meaning ACh has nowhere to go and accumulates.",
      "The classic 'SLUDGE' presentation (Salivation, Lacrimation, Urination, Defecation, GI upset, Emesis) plus pinpoint pupils and bradycardia are all signs of muscarinic ACh receptor overstimulation, concentrated in parasympathetic target organs.",
      "Atropine improving the heart rate confirms it: atropine blocks muscarinic ACh receptors, so if blocking those receptors helps, ACh overstimulation was the problem in the first place.",
      "The twitching-then-weakness pattern reflects nicotinic ACh receptors at the neuromuscular junction — initially overstimulated, then unable to repolarize properly."
    ],
    distractorNote: "Students sometimes pick GABA excess because the patient becomes weak/sedated-looking. The distinguishing detail is the secretions and pinpoint pupils — these are autonomic/muscarinic signs specific to ACh, not a feature of GABA excess (which would look more like global CNS sedation without the SLUDGE symptoms)."
  }
},

// ---------------------------------------------------------------
// CASE 3 — Dopamine DEFICIENCY (Parkinson's)
// ---------------------------------------------------------------
{
  id: 3,
  tab: "CASE 03",
  patientName: "Mrs. Carmen Iglesias, 67",
  complaint: "Referred for a 'shaking hand' that's worse at rest and a noticeably slower, shuffling walk over the past year. Family also mentions a flatter facial expression.",
  vitals: [
    ["Resting tremor", "Present, right hand, 'pill-rolling'", true],
    ["Gait", "Shuffling, reduced arm swing", true],
    ["Facial expression", "Reduced (hypomimia)", true],
    ["Muscle tone", "Rigid (cogwheel rigidity)", true],
    ["Cognition", "Intact", false]
  ],
  correctNT: "da",
  correctDirection: "low",
  questions: [
    { q: "When is the tremor worst?", a: "\"It's worst when my hand is just resting in my lap. When I actually go to pick something up, it almost disappears.\"", unlocks: "resting-tremor" },
    { q: "Tell me about your walking.", a: "\"My husband says I shuffle now. I used to stride out, but my feet barely lift, and I don't swing my arms like I used to.\"", unlocks: "gait" },
    { q: "Any change in memory or thinking?", a: "\"No, my mind's as sharp as ever, thank goodness. It's just my body that won't cooperate.\"", unlocks: "cognition-intact" },
    { q: "Has anyone commented on your expression?", a: "\"My daughter keeps asking if I'm upset about something. I'm not — apparently my face just doesn't show it anymore.\"", unlocks: "hypomimia" },
    { q: "Is there a family history or known cause?", a: "Neurologist's note: \"Imaging shows reduced dopaminergic activity in the substantia nigra, consistent with idiopathic Parkinson's disease.\"", unlocks: "imaging" }
  ],
  evidence: [
    { id: "resting-tremor", label: "Tremor character", text: "Present at rest, reduces with intentional movement." },
    { id: "gait", label: "Gait analysis", text: "Shuffling steps, reduced arm swing (bradykinesia)." },
    { id: "cognition-intact", label: "Cognitive status", text: "No memory or thinking impairment." },
    { id: "hypomimia", label: "Facial exam", text: "Hypomimia — reduced facial expressiveness." },
    { id: "imaging", label: "Neuroimaging", text: "Reduced dopaminergic activity in the substantia nigra." }
  ],
  explanation: {
    correctSummary: "This is dopamine deficiency from Parkinson's disease. Dopaminergic neurons in the substantia nigra project to the striatum to enable smooth, initiated movement; when they degenerate, the classic triad of resting tremor, rigidity, and bradykinesia (slowed movement) appears.",
    keyClues: [
      "Resting tremor that improves with intentional movement is a specific hallmark of basal ganglia dopamine pathway dysfunction, distinct from cerebellar tremors (which worsen with movement).",
      "Shuffling gait, reduced arm swing, and hypomimia are all bradykinesia signs — dopamine's core role is initiating and scaling movement, so its loss makes movements smaller and slower.",
      "Imaging confirming reduced substantia nigra dopaminergic activity directly identifies both the transmitter and the direction (deficiency).",
      "Intact cognition is an important negative clue: it argues against this being primarily an acetylcholine/memory-circuit problem, keeping the diagnosis localized to the motor dopamine pathway."
    ],
    distractorNote: "Students sometimes guess GABA because rigidity sounds like an inhibition problem. But the deficiency here is upstream: dopamine normally helps balance the direct/indirect striatal pathways, and losing it disrupts that balance, producing rigidity and tremor — the rigidity is a downstream consequence of dopamine loss, not a sign of a primary GABA problem."
  }
},

// ---------------------------------------------------------------
// CASE 4 — Dopamine EXCESS (stimulant toxicity / psychosis)
// ---------------------------------------------------------------
{
  id: 4,
  tab: "CASE 04",
  patientName: "Jordan T., 24",
  complaint: "Brought to ED by friends after becoming agitated, paranoid, and convinced 'people are watching through the walls.' Pupils dilated, heart racing, picking at skin.",
  vitals: [
    ["Heart rate", "138 bpm", true],
    ["Pupils", "Dilated (mydriasis)", true],
    ["Behavior", "Paranoid, hypervigilant, repetitive skin-picking", true],
    ["Body temperature", "38.9°C", true],
    ["Speech", "Pressured, rapid", true]
  ],
  correctNT: "da",
  correctDirection: "high",
  questions: [
    { q: "What's been going on tonight?", a: "Friend says: \"We were at a party and he took something — I think it was crystal meth — and within an hour he was a different person. Convinced everyone was an undercover cop.\"", unlocks: "stimulant-use" },
    { q: "Describe the paranoid behavior.", a: "\"He kept saying people were watching him through the walls, picking at his arms like there was something on his skin. It was scary to watch.\"", unlocks: "psychosis" },
    { q: "Any cardiovascular symptoms?", a: "Nurse: \"Heart rate's been over 130 since arrival, and his pupils are blown wide.\"", unlocks: "cardio" },
    { q: "Has he taken anything like this before?", a: "\"He's used it a few times before, but never gotten this bad. He said the high felt 'incredible' at first, like everything mattered intensely.\"", unlocks: "euphoria-history" },
    { q: "Family or personal psychiatric history?", a: "\"No history of schizophrenia or anything like that — this only happens when he's using.\"", unlocks: "no-baseline-psych" }
  ],
  evidence: [
    { id: "stimulant-use", label: "Substance history", text: "Methamphetamine use within the last hour." },
    { id: "psychosis", label: "Mental state", text: "Paranoid delusions, tactile hallucinations (formication/skin-picking)." },
    { id: "cardio", label: "Cardiovascular signs", text: "Tachycardia, mydriasis (sympathomimetic toxidrome)." },
    { id: "euphoria-history", label: "Subjective effect", text: "Reports intense euphoria and heightened salience of surroundings." },
    { id: "no-baseline-psych", label: "Psychiatric baseline", text: "No psychiatric history outside of substance use — psychosis is substance-induced." }
  ],
  explanation: {
    correctSummary: "This is dopamine excess from stimulant (methamphetamine) toxicity. Methamphetamine massively increases dopamine release and blocks its reuptake, flooding mesolimbic reward circuits and mesocortical/striatal circuits, which produces euphoria, hypervigilance, and paranoid psychosis at high levels.",
    keyClues: [
      "The euphoria and 'heightened salience' description maps directly onto dopamine's role in reward and motivation — excess dopamine makes ordinary stimuli feel intensely significant, including imagined threats.",
      "Paranoid psychosis with tactile hallucinations (formication) is a well-documented dopamine-excess toxidrome from stimulants, distinct from primary psychiatric psychosis because it resolves as the drug clears.",
      "Tachycardia, dilated pupils, and hyperthermia are sympathomimetic signs reflecting dopamine's overlap with adrenergic-like effects at high concentrations.",
      "No baseline psychiatric history strengthens the case that this is substance-induced rather than a separate primary condition, keeping the explanation localized to acute dopamine excess."
    ],
    distractorNote: "Some students pick noradrenaline because of the tachycardia and hypervigilance. While NA contributes to the sympathetic arousal seen here, the hallmark psychotic features (paranoia, intense subjective reward, repetitive stereotyped skin-picking) are specifically dopamine-driven; NA excess alone produces anxiety/arousal but not this dopamine-typical psychotic and reward-seeking pattern."
  }
},

// ---------------------------------------------------------------
// CASE 5 — Serotonin DEFICIENCY (depression)
// ---------------------------------------------------------------
{
  id: 5,
  tab: "CASE 05",
  patientName: "Priya N., 29",
  complaint: "Self-referred after three months of low mood, loss of interest in hobbies, disrupted sleep, and changed appetite. No movement or autonomic abnormalities on exam.",
  vitals: [
    ["Heart rate", "72 bpm", false],
    ["Sleep pattern", "Early morning waking, non-restorative", true],
    ["Appetite", "Decreased, 4kg weight loss in 2 months", true],
    ["Motor exam", "Normal, mild psychomotor slowing", false],
    ["Affect", "Flat, low mood most of the day", true]
  ],
  correctNT: "5ht",
  correctDirection: "low",
  questions: [
    { q: "How has your mood been?", a: "\"Low. Most days, most of the time, for about three months now. Things I used to love — painting, seeing friends — just don't pull at me anymore.\"", unlocks: "anhedonia" },
    { q: "How's your sleep?", a: "\"I wake up at 4am every day and can't get back to sleep, even though I'm exhausted. It didn't used to be like this.\"", unlocks: "sleep" },
    { q: "Any change in appetite or weight?", a: "\"I've lost interest in food. I've dropped almost 4kg without trying.\"", unlocks: "appetite" },
    { q: "Any tremor, stiffness, or movement changes?", a: "\"No tremor or anything like that. I just feel slow, like everything takes more effort than it should.\"", unlocks: "no-tremor" },
    { q: "Has anything helped or been tried so far?", a: "\"My GP just started me on an SSRI — sertraline. Too early to tell if it's working yet.\"", unlocks: "ssri-started" }
  ],
  evidence: [
    { id: "anhedonia", label: "Mood/interest", text: "Persistent low mood and anhedonia (loss of interest) for 3 months." },
    { id: "sleep", label: "Sleep pattern", text: "Early morning awakening, non-restorative sleep." },
    { id: "appetite", label: "Appetite/weight", text: "Decreased appetite, unintentional weight loss." },
    { id: "no-tremor", label: "Motor exam", text: "No tremor or rigidity — psychomotor slowing only." },
    { id: "ssri-started", label: "Treatment", text: "Started on sertraline, a selective serotonin reuptake inhibitor (SSRI)." }
  ],
  explanation: {
    correctSummary: "This presentation matches serotonin deficiency underlying major depressive disorder. Serotonin pathways from the raphe nuclei modulate mood, sleep architecture, and appetite — the classic triad disrupted here.",
    keyClues: [
      "The combination of low mood, anhedonia, sleep disruption, and appetite change together (not just one in isolation) reflects the broad regulatory role serotonin plays across multiple circuits, which is why depression affects so many systems at once.",
      "Sertraline is the confirming clue: SSRIs work by blocking serotonin reuptake to increase its availability at the synapse, which only makes therapeutic sense if serotonin signalling was insufficient to begin with.",
      "The absence of tremor, rigidity, or other motor signs argues against a dopamine pathway problem, keeping this localized to mood/affect circuits rather than movement circuits.",
      "Normal heart rate and no autonomic symptoms argue against this being primarily a noradrenaline-driven anxiety/arousal presentation."
    ],
    distractorNote: "Students sometimes guess GABA, reasoning that 'low mood' sounds like 'low inhibition is wrong.' The distinguishing feature is the specific triad of mood + sleep + appetite changes plus the SSRI response — GABA deficiency presents more as anxiety/seizure susceptibility, not this mood-sleep-appetite pattern."
  }
},

// ---------------------------------------------------------------
// CASE 6 — Serotonin EXCESS (serotonin syndrome)
// ---------------------------------------------------------------
{
  id: 6,
  tab: "CASE 06",
  patientName: "Mr. Aaron Bell, 45",
  complaint: "Brought to ED confused and agitated after his SSRI dose was recently increased and he also started taking an OTC cold medication. Presents with tremor, sweating, and muscle twitching.",
  vitals: [
    ["Heart rate", "124 bpm", true],
    ["Body temperature", "39.4°C (hyperthermic)", true],
    ["Reflexes", "Hyperreflexia, especially lower limbs", true],
    ["Muscle activity", "Clonus, tremor", true],
    ["Mental state", "Agitated, confused", true]
  ],
  correctNT: "5ht",
  correctDirection: "high",
  questions: [
    { q: "What medications is he taking?", a: "Wife: \"His psychiatrist increased his sertraline last week, and he's been taking a cold and flu tablet for the last two days — I think it had dextromethorphan in it.\"", unlocks: "drug-combo" },
    { q: "Describe his reflexes and muscle activity.", a: "ED doctor: \"Markedly hyperreflexic, especially in the legs, with spontaneous clonus and tremor — much more than I'd expect from anxiety alone.\"", unlocks: "hyperreflexia" },
    { q: "What's his temperature and heart rate doing?", a: "\"Temp's climbing — 39.4 now — and his heart rate's been over 120 since he came in.\"", unlocks: "hyperthermia" },
    { q: "How is his mental state?", a: "\"He's agitated, talking fast, seems confused about where he is. Not like himself.\"", unlocks: "agitation" },
    { q: "Timeline — when did symptoms start relative to the medication change?", a: "\"Within about 24 hours of starting both the higher sertraline dose and the cold medicine. That can't be a coincidence, can it?\"", unlocks: "timeline" }
  ],
  evidence: [
    { id: "drug-combo", label: "Medication history", text: "Recent SSRI dose increase + dextromethorphan (also raises serotonin) together." },
    { id: "hyperreflexia", label: "Neuro exam", text: "Hyperreflexia and clonus, disproportionate to anxiety alone." },
    { id: "hyperthermia", label: "Vital signs", text: "Hyperthermia and tachycardia." },
    { id: "agitation", label: "Mental state", text: "Agitation and confusion." },
    { id: "timeline", label: "Onset timeline", text: "Symptom onset within 24 hours of combining two serotonergic drugs." }
  ],
  explanation: {
    correctSummary: "This is serotonin excess — serotonin syndrome — caused by combining two drugs that both increase serotonin activity (an SSRI plus dextromethorphan, which also has serotonergic activity). Too much serotonin overstimulates both CNS and peripheral 5-HT receptors.",
    keyClues: [
      "The drug combination is the central clue: serotonin syndrome is a recognized risk whenever two or more serotonergic agents are combined, and the rapid onset right after combining them is a textbook pattern.",
      "Hyperreflexia and clonus (especially prominent in the lower limbs) are distinguishing neuromuscular signs of serotonin syndrome, helping differentiate it from generic anxiety or simple stimulant intoxication.",
      "Hyperthermia and tachycardia reflect serotonin's role in autonomic regulation when present in excess.",
      "The tight 24-hour timeline linking symptom onset to the medication change supports causation rather than coincidence."
    ],
    distractorNote: "This case is often confused with the organophosphate poisoning case (ACh excess) because both involve sweating and tremor. The differentiator is pupils and secretions: ACh excess produces pinpoint pupils and heavy secretions (drooling), while serotonin excess produces hyperreflexia/clonus and hyperthermia without the SLUDGE pattern. Always check the full clue set, not just one overlapping symptom."
  }
},

// ---------------------------------------------------------------
// CASE 7 — Noradrenaline EXCESS (panic / pheochromocytoma)
// ---------------------------------------------------------------
{
  id: 7,
  tab: "CASE 07",
  patientName: "Ms. Felicity Okoro, 33",
  complaint: "Recurrent episodes of sudden pounding heart, sweating, trembling, and a sense of impending doom, lasting 10-20 minutes, occurring several times over the past month with no clear trigger.",
  vitals: [
    ["Heart rate (during episode)", "150 bpm", true],
    ["Blood pressure (during episode)", "168/102", true],
    ["Pupils", "Dilated during episodes", true],
    ["Heart rate (between episodes)", "76 bpm", false],
    ["Anxiety screening", "Reports intense fear of dying during episodes", true]
  ],
  correctNT: "ne",
  correctDirection: "high",
  questions: [
    { q: "Describe what happens during an episode.", a: "\"Out of nowhere, my heart starts pounding so hard I think it'll burst out of my chest. I start shaking, sweating, and I'm convinced something terrible is about to happen.\"", unlocks: "episode-description" },
    { q: "How long do they last and how often?", a: "\"Ten, maybe twenty minutes. They've happened five or six times this month, completely unpredictable.\"", unlocks: "frequency" },
    { q: "Is there a clear trigger?", a: "\"That's the strange part — sometimes I'm just sitting watching TV. There's no pattern I can find.\"", unlocks: "no-trigger" },
    { q: "What's your blood pressure like during an episode versus normally?", a: "Nurse: \"During an episode we caught 168 over 102 and pupils were dilated. Between episodes, she's a completely normal 118 over 76.\"", unlocks: "bp-spike" },
    { q: "Any further testing been done?", a: "\"They're now testing my urine for catecholamine metabolites, to check if there's a tumor releasing extra adrenaline-type hormones, since this could be a panic disorder or something physical.\"", unlocks: "catecholamine-test" }
  ],
  evidence: [
    { id: "episode-description", label: "Episode description", text: "Sudden pounding heart, trembling, sense of doom." },
    { id: "frequency", label: "Pattern", text: "Recurrent, episodic, 10-20 min duration, several per month." },
    { id: "no-trigger", label: "Trigger analysis", text: "No identifiable external trigger." },
    { id: "bp-spike", label: "Vitals comparison", text: "Sharp BP/HR spike during episodes vs. normal baseline between them." },
    { id: "catecholamine-test", label: "Workup", text: "Urinary catecholamine metabolite testing in progress." }
  ],
  explanation: {
    correctSummary: "This presentation reflects noradrenaline excess driving an acute sympathetic surge — the physiology of a panic attack (and a key differential, pheochromocytoma, is being appropriately tested for). Noradrenaline release from the locus coeruleus and adrenal medulla drives the 'fight or flight' response.",
    keyClues: [
      "The episodic surge pattern — sudden onset, pounding heart, trembling, sweating, intense fear — maps directly onto noradrenaline's role as the driver of acute sympathetic arousal.",
      "The sharp contrast between episode vitals (150 bpm, 168/102, dilated pupils) and normal baseline vitals between episodes shows this is an episodic surge in noradrenergic tone, not a constant baseline abnormality.",
      "Testing for catecholamine metabolites directly targets noradrenaline (and adrenaline) breakdown products, confirming the system under investigation.",
      "The 'sense of impending doom' is a classic descriptor of acute noradrenaline-driven sympathetic activation, distinct from the persistent low mood of a serotonin-related presentation."
    ],
    distractorNote: "Students sometimes confuse this with dopamine excess because both involve hyperarousal. The key differentiator is the absence of euphoria, reward-seeking, or psychotic features (paranoia, hallucinations) — this is pure sympathetic/fear-circuit activation, which is noradrenaline's signature, not dopamine's reward-and-movement signature."
  }
},

// ---------------------------------------------------------------
// CASE 8 — GABA deficiency vs Glutamate excess (seizure)
// ---------------------------------------------------------------
{
  id: 8,
  tab: "CASE 08",
  patientName: "Liam Foster, 19",
  complaint: "University student found having a generalized tonic-clonic seizure at a party. Roommate reports he abruptly stopped his prescribed inhibitory boosting anti-seizure medication a week ago to 'see if he still needed it.'",
  vitals: [
    ["Seizure type", "Generalized tonic-clonic, 90 seconds", true],
    ["Post-ictal state", "Confused, drowsy for ~20 min", true],
    ["EEG (post-event)", "Diffuse excessive cortical excitability", true],
    ["Heart rate", "104 bpm (during/just after seizure)", false],
    ["Known history", "Epilepsy diagnosed age 16, on anti-seizure medication", true]
  ],
  correctNT: "gaba",
  correctDirection: "low",
  questions: [
    { q: "What happened leading up to the seizure?", a: "Roommate: \"He told me a week ago he stopped taking his seizure pills — I think it was a benzodiazepine-type one. He wanted to see if he still needed it. Bad idea, clearly.\"", unlocks: "medication-stopped" },
    { q: "What does the seizure look like, and how is he afterward?", a: "\"His whole body went stiff, then started jerking for what felt like forever but was probably a minute or two. Now he's groggy and confused.\"", unlocks: "seizure-description" },
    { q: "What was the medication for, mechanistically?", a: "Pharmacist's note on file: \"Clonazepam — a benzodiazepine that enhances GABA-A receptor activity to dampen neuronal excitability.\"", unlocks: "med-mechanism" },
    { q: "What does the EEG show?", a: "Neurologist: \"Diffuse cortical hyperexcitability consistent with a lowered seizure threshold — exactly what we'd expect with abrupt withdrawal from a GABA-enhancing medication.\"", unlocks: "eeg" },
    { q: "Could this be a primary excess of an excitatory transmitter instead?", a: "Neurologist: \"That's the right question to ask — glutamate excess can also cause seizures directly. But here, the trigger is clearly the missing inhibitory brake, not a new excitatory surge. The chemistry doesn't start with too much excitation; it starts with too little inhibition holding it back.\"", unlocks: "gaba-vs-glu" }
  ],
  evidence: [
    { id: "medication-stopped", label: "Medication history", text: "Abrupt discontinuation of clonazepam (a benzodiazepine) one week prior." },
    { id: "seizure-description", label: "Seizure semiology", text: "Generalized tonic-clonic seizure with post-ictal confusion." },
    { id: "med-mechanism", label: "Drug mechanism", text: "Clonazepam enhances GABA-A receptor activity (boosts inhibition)." },
    { id: "eeg", label: "EEG findings", text: "Diffuse cortical hyperexcitability, lowered seizure threshold." },
    { id: "gaba-vs-glu", label: "Differential reasoning", text: "Trigger is loss of inhibitory tone (GABA withdrawal), not a new excitatory (glutamate) surge." }
  ],
  explanation: {
    correctSummary: "This is GABA deficiency caused by abrupt benzodiazepine withdrawal. GABA is the brain's main inhibitory transmitter, acting like a brake on neuronal firing; clonazepam artificially enhances that brake, and the brain partly adapts to relying on it. Stopping it suddenly removes the brake faster than the brain can compensate, so excitatory activity goes unchecked and a seizure results.",
    keyClues: [
      "The medication is the central clue: clonazepam works specifically by enhancing GABA-A receptor activity, so a seizure appearing right after stopping it points directly at a sudden loss of GABA-mediated inhibition.",
      "The one-week gap between stopping the medication and the seizure fits the known withdrawal timeline for benzodiazepines, supporting causation.",
      "The EEG showing diffuse hyperexcitability (rather than a focal abnormal lesion) is consistent with a global loss of inhibitory tone rather than a localized structural problem.",
      "This case is deliberately designed to test the GABA-vs-glutamate distinction: both can cause seizures, but the mechanism here is a missing brake (GABA loss), not a new accelerator (glutamate surge) — the same end result (excessive firing) can come from either side of the balance, so identifying which side changed is the actual diagnostic skill."
    ],
    distractorNote: "This is the trickiest case in the unit on purpose. Many students correctly identify 'excessive excitability' but then default to glutamate, since glutamate is the excitatory transmitter and seizures involve excessive firing. The diagnostic skill here is recognizing that excessive firing can result from too much excitation OR too little inhibition — and the evidence (a GABA-enhancing drug being withdrawn) tells you which side of that balance actually moved. If this had instead described, say, a glutamate-receptor-overactivating toxin with no GABAergic drug history, glutamate excess would be the correct call."
  }
}

];
