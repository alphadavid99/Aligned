// French translation overlay for the question bank.
//
// The canonical English bank lives in questions.ts (mirrored from the .xlsx per
// CLAUDE.md §9) and is NOT edited here. This file maps deck slugs → French names
// and question ids → French text/options/scale-labels. Anything missing falls
// back to English, so the app never breaks on a gap.
//
// Option order MUST match the English exactly — answers are stored by index.
// Tone rule (CLAUDE.md §1): stay honest and direct on contentious topics — do
// not soften. Translations mirror the plain, unhedged English.
import { DECKS, type Question } from "./questions";
import type { Lang } from "./i18n";

export const DECK_NAMES_FR: Record<string, string> = {
  "in-the-home": "À la maison",
  "finances-money": "Finances & argent",
  "faith-worship-practice": "Foi & pratique du culte",
  "roles-responsibilities": "Rôles & responsabilités",
  "theology-beliefs": "Théologie & croyances",
  "dreams-future": "Rêves & avenir",
  "family-children": "Famille & enfants",
  "parenting-style": "Style d’éducation",
  "intimacy-physical": "Intimité & physique",
  "conflict-communication": "Conflit & communication",
  "in-laws-extended-family": "Belle-famille & proches",
  "fun-icebreakers": "Détente & brise-glace",
  "deal-breakers": "Points rédhibitoires",
  "health-lifestyle": "Santé & mode de vie",
  "past-baggage": "Passé & bagages",
  "career-ambition": "Carrière & ambition",
  "character-self-awareness": "Caractère & connaissance de soi",
  "us-compatibility": "Nous & compatibilité",
  "values-convictions": "Valeurs & convictions",
  "faithfulness-loyalty": "Fidélité & loyauté",
  "where-we-are-now": "Où nous en sommes",
};

/** Per-question French fields. Only the user-facing text is translated. */
export type QFr = { q: string; opts?: string[]; lo?: string; hi?: string };

export const Q_FR: Record<string, QFr> = {
  // --- In the Home ---
  "HOME-001": { q: "Qui cuisine le plus à la maison ?", opts: ["Surtout lui", "Surtout elle", "Autant l’un que l’autre", "On partage selon le repas ou le jour"] },
  "HOME-002": { q: "Qui s’occuperait de la plupart des tâches ménagères ?", opts: ["Surtout lui", "Surtout elle", "À parts égales", "On alterne"] },
  "HOME-003": { q: "Que penses-tu des animaux à la maison — plutôt chien ou chat ?", opts: ["Les chiens", "Les chats", "Les deux", "Aucun", "Ça dépend de l’animal"] },
  "HOME-004": { q: "Où nous imagines-tu poser nos racines — en ville, en banlieue, ou dans un endroit plus calme ?", opts: ["En ville", "En banlieue", "À la campagne / petite ville", "Ouvert à n’importe où"] },
  "HOME-005": { q: "À quel point veux-tu que notre foyer soit ouvert et accueillant envers les autres ?", lo: "Notre foyer est notre espace privé", hi: "Toujours ouvert aux autres" },
  "HOME-006": { q: "À quel point as-tu besoin que notre foyer soit rangé ?", lo: "Détendu face au désordre", hi: "Chaque chose à sa place" },
  "HOME-007": { q: "À quel point est-ce important pour toi d’être propriétaire plutôt que locataire ?", lo: "Louer me convient", hi: "Être propriétaire compte beaucoup" },
  "HOME-008": { q: "Qui devrait s’occuper des réparations et de l’entretien de la maison ?", opts: ["Surtout lui", "Surtout elle", "Nous deux", "On ferait appel à un pro"] },
  "HOME-009": { q: "À quel point est-ce important d’avoir un espace à toi seul à la maison ?", lo: "Tout partager me convient", hi: "J’ai besoin de mon propre espace" },

  // --- Finances & Money ---
  "FIN-001": { q: "Un couple marié devrait-il tout mettre en commun, garder des comptes séparés, ou un mélange ?", opts: ["Tout en commun", "Tout séparé", "Un mélange de commun et de personnel"] },
  "FIN-002": { q: "Que penses-tu de l’endettement ?", lo: "Éviter toute dette", hi: "À l’aise avec le fait d’en avoir" },
  "FIN-003": { q: "À quel point devrions-nous être transparents financièrement l’un envers l’autre ?", lo: "Garder certaines choses privées", hi: "Totalement transparents" },
  "FIN-004": { q: "À quel point es-tu discipliné avec un budget mensuel ?", lo: "Peu rigoureux côté budget", hi: "Je suis chaque centime" },
  "FIN-005": { q: "Comment devrait-on gérer l’argent au quotidien ?", opts: ["Un budget commun qu’on suit tous les deux", "Surtout l’un de nous le gère", "Souple, sans budget strict", "On cherche encore"] },
  "FIN-006": { q: "À quel point privilégies-tu l’épargne à long terme ?", lo: "Vivre pour aujourd’hui", hi: "Épargner à fond pour l’avenir" },
  "FIN-007": { q: "Que penses-tu d’un contrat de mariage ?", opts: ["J’en veux un", "Ouvert à l’idée", "Je préfère pas", "Fermement contre"] },
  "FIN-008": { q: "Au-delà de nos enfants, qui notre testament devrait-il prévoir ?", opts: ["Juste nous et nos enfants", "La famille élargie aussi", "L’Église ou une œuvre aussi", "Je n’y ai pas réfléchi"] },
  "FIN-009": { q: "Sois honnête — es-tu plutôt épargnant ou dépensier ?", lo: "Épargnant jusqu’à l’os", hi: "Dépensier dans l’âme" },
  "FIN-010": { q: "À quel point est-ce important qu’on soit alignés sur l’argent ?", lo: "On peut diverger librement", hi: "On doit être d’accord" },
  "FIN-011": { q: "Quand tu es stressé, à quelle fréquence dépenses-tu ou fais-tu les magasins pour te sentir mieux ?", lo: "Jamais", hi: "Très souvent" },
  "FIN-012": { q: "S’il nous restait de l’argent chaque mois, où devrait aller l’essentiel ?", opts: ["Donner ou servir", "Épargner pour l’avenir", "Expériences et voyages", "Ce qui nous fait plaisir maintenant"] },
  "FIN-013": { q: "Combien de dettes apportes-tu dans la relation ?", opts: ["Aucune", "Un petit montant", "Un montant modéré", "Un montant important"] },
  "FIN-014": { q: "Comment évaluerais-tu ta cote de crédit ?", opts: ["Excellente", "Bonne", "Correcte", "Mauvaise", "Je ne sais pas"] },
  "FIN-015": { q: "Devrions-nous rembourser les grosses dettes avant d’avoir des enfants ?", lo: "Pas une priorité", hi: "Essentiel de tout solder d’abord" },
  "FIN-016": { q: "Comment vois-tu ce que tu possèdes ?", opts: ["À moi, pour en profiter comme je veux", "Surtout à moi, avec un peu de don", "À Dieu, et je n’en suis que le gestionnaire", "Je n’y ai pas vraiment réfléchi"] },
  "FIN-017": { q: "À quel point est-ce important pour toi qu’on ait un filet de sécurité financier en cas d’urgence ?", lo: "On gérera les problèmes au fur et à mesure", hi: "Je veux un solide coussin d’urgence" },

  // --- Faith & Worship practice ---
  "FAITH-001": { q: "À quel point prier ensemble en couple est-il essentiel pour toi ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-002": { q: "À quel point ta foi est-elle centrale dans ton quotidien ?", lo: "Un aspect en arrière-plan", hi: "Elle est au centre de tout" },
  "FAITH-003": { q: "À quel point es-tu engagé dans le don régulier ou la dîme ?", lo: "Pas une priorité", hi: "Un engagement ferme" },
  "FAITH-004": { q: "À quelle fréquence voudrais-tu qu’on prie ensemble ?", opts: ["Chaque jour", "Quelques fois par semaine", "De temps en temps", "Je préfère prier en privé"] },
  "FAITH-005": { q: "À quel point devrait-on être ouverts l’un envers l’autre sur nos vies spirituelles ?", lo: "Garder la foi privée", hi: "Totalement ouverts et redevables" },
  "FAITH-006": { q: "Quand notre foi diffère, comment devrait-on gérer ça ?", opts: ["On doit être d’accord", "En parler jusqu’à s’accorder", "Respecter nos différences", "Éviter le sujet"] },
  "FAITH-007": { q: "À quel point veux-tu t’investir dans la communauté de l’Église et les petits groupes ?", lo: "Rarement impliqué", hi: "Très impliqué" },
  "FAITH-008": { q: "Dans quelle mesure devrait-on façonner la croissance spirituelle de l’autre ?", lo: "La foi est personnelle", hi: "On devrait activement faire grandir celle de l’autre" },
  "FAITH-009": { q: "À quel point es-tu prêt à vivre à contre-courant de la culture pour ta foi ?", lo: "Me fondre dans la culture", hi: "Me démarquer pour nos convictions" },
  "FAITH-010": { q: "Quelle a été ta meilleure expérience avec l’Église — et la pire ? À quel point veux-tu t’y investir ?" },
  "FAITH-011": { q: "Que t’a appris Dieu à travers les moments difficiles — l’échec, l’attente, la perte, la déception ?" },
  "FAITH-012": { q: "Si tu pouvais poser une seule question à Dieu, laquelle serait-ce ?" },
  "FAITH-013": { q: "Classe ce à quoi sert avant tout le mariage.", opts: ["La compagnie", "Fonder une famille", "La foi et servir Dieu", "Grandir l’un l’autre", "L’amour et la romance"] },
  "FAITH-014": { q: "À quel point est-ce important qu’on partage les mêmes convictions de foi ?", lo: "On peut diverger librement", hi: "On doit être d’accord" },
  "FAITH-015": { q: "À quel point une vie de prière personnelle est-elle importante pour toi ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-016": { q: "À quel point est-ce important que ton partenaire ait sa propre vie de prière, en dehors de toi ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-017": { q: "Devrions-nous prier ensemble avant les grandes décisions ?", lo: "Rarement", hi: "Toujours" },
  "FAITH-018": { q: "À quel point est-ce important que la relation de ton partenaire avec Dieu passe avant sa relation avec toi ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-019": { q: "Quand ton temps avec Dieu et ton temps avec ton partenaire se disputent la même heure, lequel l’emporte d’habitude ?", lo: "La relation l’emporte souvent", hi: "Dieu passe toujours en premier" },
  "FAITH-020": { q: "Quel rythme de lecture personnelle de la Bible espères-tu tenir ?", opts: ["Chaque jour", "La plupart des jours", "Chaque semaine", "De temps en temps"] },
  "FAITH-021": { q: "À quel point est-ce important d’étudier régulièrement la Bible ensemble en couple ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-022": { q: "Notre relation devrait activement nous rapprocher tous les deux de Dieu, et pas seulement laisser notre foi intacte.", lo: "Pas du tout d’accord", hi: "Tout à fait d’accord" },
  "FAITH-023": { q: "Qui devrait conduire la prière et la vie spirituelle à la maison ?", opts: ["Le mari", "La femme", "Celui qui se sent conduit sur le moment", "Chacun son tour", "Toujours ensemble, personne ne dirige"] },
  "FAITH-024": { q: "À quel point est-ce important pour toi que ton partenaire soit né de nouveau, avec une conversion personnelle ?", lo: "Pas important", hi: "Essentiel" },
  "FAITH-025": { q: "À quel point es-tu sûr de ton propre salut ?", lo: "Je me questionne encore", hi: "Pleinement assuré" },
  "FAITH-026": { q: "Si on vient d’Églises différentes, comment décider où aller ensemble ?", opts: ["On va à la mienne", "On va à la tienne", "On en trouve une nouvelle ensemble", "Ça nous va d’y aller séparément"] },
  "FAITH-027": { q: "Comment évaluerais-tu l’état actuel de ta marche avec Dieu ?", lo: "Dans une saison aride", hi: "Florissante" },
  "FAITH-028": { q: "Dans quelle mesure l’Écriture façonne-t-elle tes décisions quotidiennes ?", lo: "Rarement un facteur", hi: "Elle guide mes décisions" },
  "FAITH-029": { q: "Quand tu lis une Écriture qui remet en question ta pensée ou tes désirs, quelle est ta réaction habituelle ?", opts: ["J’ajuste mon point de vue à l’Écriture", "Je lutte, mais je me soumets d’habitude", "Je cherche une autre interprétation", "Je suis ma propre conviction"] },
  "FAITH-030": { q: "Quand tu pèches, quel est ton réflexe ?", opts: ["Confesser et chercher à rendre des comptes", "Le dire à Dieu en privé et passer à autre chose", "Essayer d’y remédier par moi-même", "J’ai tendance à le cacher"] },
  "FAITH-031": { q: "À quel point est-ce important pour toi qu’on serve activement dans une Église, pas seulement qu’on y assiste ?", lo: "Y assister suffit", hi: "Servir compte vraiment" },
  "FAITH-032": { q: "Comment veux-tu le plus servir dans une Église ?", opts: ["Enseigner ou diriger", "Accueil et relations", "En coulisses", "Évangélisation et mission", "Ce n’est pas une priorité pour moi"] },
  "FAITH-033": { q: "À quel point es-tu ouvert à être encadré et repris par des croyants mûrs ?", lo: "Je préfère me débrouiller seul", hi: "Je l’accueille volontiers" },
  "FAITH-034": { q: "À quel point la foi devrait-elle être centrale dans la vie quotidienne de notre foyer ?", lo: "Une affaire privée et personnelle", hi: "Le centre de notre foyer" },
  "FAITH-035": { q: "Prends-tu en main ta croissance spirituelle, ou t’appuierais-tu sur ton partenaire pour te guider ?", lo: "Je prends en main ma croissance", hi: "Je m’appuierais sur mon partenaire pour me guider" },

  // --- Roles & Responsibilities ---
  "ROLE-001": { q: "Comment vois-tu les rôles et le leadership fonctionner dans un mariage ?", opts: ["Le mari dirige, la femme soutient", "Soumission mutuelle, partenaires égaux", "Pas de rôles fixes", "On cherche encore"] },
  "ROLE-002": { q: "Comment imagines-tu l’équilibre entre travail et foyer — l’un de nous voudrait-il rester à la maison, surtout avec des enfants ?", opts: ["L’un de nous reste à la maison", "Nous travaillons tous les deux", "Ça dépend de la saison de vie"] },
  "ROLE-003": { q: "À quel point est-ce important qu’on s’accorde sur les rôles et responsabilités du mariage ?", lo: "On peut diverger librement", hi: "On doit être d’accord" },
  "ROLE-004": { q: "À quel point est-ce important pour toi que le mari soit le principal pourvoyeur financier ?", lo: "Pas important", hi: "Essentiel" },
  "ROLE-005": { q: "À quel point prends-tu « le mari est le chef du foyer » au pied de la lettre ?", lo: "Symbolique, on partage le leadership", hi: "Autorité masculine au sens littéral" },

  // --- Theology & Beliefs ---
  "THEO-001": { q: "Crois-tu qu’une femme peut prêcher ou être pasteur dans une Église ?", opts: ["Oui", "Non", "Ça dépend du rôle", "Je cherche encore"] },
  "THEO-002": { q: "Théologiquement, où te situes-tu ?", lo: "Traditionnel / conservateur", hi: "Progressiste" },
  "THEO-003": { q: "Le salut peut-il être perdu ?", opts: ["Non — une fois sauvé, toujours sauvé", "Oui, il peut être perdu", "Pas sûr", "Ça m’importe peu"] },
  "THEO-004": { q: "Les croyants peuvent-ils être touchés par l’oppression spirituelle ?", opts: ["Oui", "Non", "Pas sûr"] },
  "THEO-005": { q: "Comment vois-tu les dons spirituels comme le parler en langues ?", opts: ["Pour aujourd’hui", "Pas pour aujourd’hui", "Pas sûr", "Pas important pour moi"] },
  "THEO-006": { q: "Où te situes-tu sur la fin des temps ?", opts: ["Enlèvement pré-tribulation", "Une autre vision de l’enlèvement", "Symbolique, pas littéral", "Je n’ai pas tranché"] },
  "THEO-007": { q: "Politiquement, où te situes-tu ?", lo: "Conservateur", hi: "Progressiste" },
  "THEO-008": { q: "À quel point est-ce important qu’on partage la même dénomination ou tradition d’Église ?", lo: "Pas important", hi: "Très important" },
  "THEO-009": { q: "Nos enfants devraient-ils être baptisés bébés, ou attendre de choisir eux-mêmes ?", opts: ["Baptiser bébés", "Les présenter maintenant, baptiser quand ils choisissent", "Attendre qu’ils puissent décider", "Pas sûr"] },
  "THEO-010": { q: "Classe les questions théologiques sur lesquelles il importe le plus qu’on s’accorde.", opts: ["Le baptême (bébé ou croyant)", "La fin des temps", "Les dons spirituels", "Les femmes dans le ministère", "Le style de louange", "Prédestination ou libre arbitre"] },

  // --- Dreams & Future ---
  "DREAM-001": { q: "À quel point ton sens du but de ta vie est-il clair ?", lo: "Je cherche encore", hi: "Très clair" },
  "DREAM-002": { q: "À quelle fréquence aimerais-tu qu’on voyage sur une année typique ?", opts: ["Rarement", "1 à 2 fois par an", "3 à 4 fois par an", "Aussi souvent que possible"] },
  "DREAM-003": { q: "À quoi ressemble la retraite pour toi ?", opts: ["Repos et simplicité", "Voyages et aventure", "Continuer à travailler ou servir", "Pas d’image claire encore"] },
  "DREAM-004": { q: "À quel point veux-tu que notre mariage ressemble à celui de tes parents ?", lo: "Très différent de celui de mes parents", hi: "Très semblable à celui de mes parents" },
  "DREAM-005": { q: "Dans dix ans, où veux-tu être — dans ton cœur, ta foi et tes finances ?" },
  "DREAM-006": { q: "Complète ceci plusieurs fois : « Si on se marie, j’adorerais qu’on… »" },

  // --- Family & Children ---
  "FAM-001": { q: "Combien d’enfants espérerais-tu ?", opts: ["Aucun", "1 à 2", "3 à 4", "5 et plus", "Ouvert / pas sûr"] },
  "FAM-002": { q: "Si on faisait face à des difficultés de fertilité, à quel point es-tu ouvert à la médecine de la reproduction ?", opts: ["Totalement ouvert au traitement", "Certaines méthodes seulement", "Je préfère accepter ce qui vient", "Pas sûr"] },
  "FAM-003": { q: "À quel point es-tu ouvert à l’adoption ?", lo: "Impatient d’adopter", hi: "Je préfère éviter" },
  "FAM-004": { q: "À quel point est-ce important qu’on s’accorde sur les enfants et l’éducation ?", lo: "On peut diverger librement", hi: "On doit être d’accord" },
  "FAM-005": { q: "Combien de temps après le mariage voudrais-tu commencer à essayer d’avoir des enfants ?", opts: ["Tout de suite", "Dans la première année ou deux", "Après plusieurs années", "On verra bien"] },
  "FAM-006": { q: "À quel point est-ce important pour toi d’avoir spécifiquement des enfants biologiques ?", lo: "Toute voie vers la famille se vaut", hi: "Les enfants biologiques comptent beaucoup" },
  "FAM-007": { q: "À quel point est-ce important que nos enfants grandissent près de la famille élargie ?", lo: "Là où la vie nous mène", hi: "Être près de la famille compte vraiment" },
  "FAM-008": { q: "Si on n’était pas d’accord sur le fait d’avoir plus d’enfants, comment gérer ça ?", opts: ["Continuer à en parler jusqu’à s’accorder", "S’en remettre à celui qui y tient le plus", "Celui qui en veut moins décide", "On chercherait de l’aide extérieure"] },
  "FAM-009": { q: "À quel point est-ce important d’élever nos enfants dans la foi ?", lo: "Les laisser choisir librement", hi: "Essentiel de les y élever" },
  "FAM-010": { q: "À quel point les grands-parents devraient-ils être impliqués dans l’éducation de nos enfants ?", lo: "Minime, c’est nous les parents", hi: "Très impliqués" },

  // --- Parenting style ---
  "PAR-001": { q: "Classe ce qui compte le plus dans l’éducation des enfants.", opts: ["La foi", "La discipline", "L’indépendance", "La bonté", "L’instruction", "La sécurité affective"] },
  "PAR-002": { q: "Dans quelle mesure élèverais-tu tes enfants comme on t’a élevé ?", lo: "Très différemment de mon éducation", hi: "À peu près pareil" },
  "PAR-003": { q: "Si un enfant remet sa foi en question, comment devrait-on réagir ?", opts: ["Le ramener avec douceur", "Le laisser explorer librement", "Intervenir avec inquiétude", "Faire confiance aux fondations posées"] },
  "PAR-004": { q: "Où se situe ton style de discipline ?", lo: "Ferme et structuré", hi: "Doux et relationnel" },
  "PAR-005": { q: "Que penses-tu de la fessée comme forme de discipline ?", opts: ["Pour", "Dans certaines situations", "Contre", "Pas sûr"] },
  "PAR-006": { q: "Comment voudrais-tu scolariser nos enfants ?", opts: ["École à la maison", "École chrétienne ou confessionnelle", "École publique", "Ce qui convient à chaque enfant"] },
  "PAR-007": { q: "À quel point veux-tu élever nos enfants à l’écart de la culture dominante ?", lo: "Pleinement dans la culture", hi: "Délibérément à part" },

  // --- Intimacy & Physical ---
  "INT-001": { q: "À quel point l’intimité physique est-elle importante pour toi dans le mariage ?", lo: "Une faible priorité", hi: "Très importante" },
  "INT-002": { q: "Quelles devraient être nos limites physiques avant le mariage ?", opts: ["Réserver toute intimité physique au mariage", "Un peu d’affection avec des limites claires", "À l’aise d’être physiquement proches", "On en discute encore"] },
  "INT-003": { q: "Quelle place l’attirance physique tient-elle dans une relation pour toi ?", lo: "Peu", hi: "Beaucoup" },
  "LOYAL-001": { q: "Où commence le fait de franchir la ligne pour toi ?", opts: ["Tout flirt", "Une proximité émotionnelle avec quelqu’un d’autre", "Seulement le contact physique", "On devrait le définir ensemble"] },
  "INT-005": { q: "À quel point es-tu à l’aise pour parler ouvertement de sexualité ?", lo: "Très mal à l’aise", hi: "Très à l’aise" },
  "LOYAL-002": { q: "Comment vois-tu la pornographie dans un mariage ?", opts: ["Jamais acceptable", "Un problème grave", "Ça dépend", "Pas si grave"] },
  "INT-007": { q: "À quel point est-ce important qu’on soit alignés sur l’intimité physique ?", lo: "On peut diverger librement", hi: "On doit être d’accord" },
  "INT-008": { q: "À quel point est-ce important pour toi que ton partenaire ait réservé, ou réserve, la sexualité au mariage ?", lo: "Pas important", hi: "Essentiel" },
  "INT-009": { q: "Quelle est ta vision du sexe avant le mariage ?", opts: ["À réserver au mariage, sans exception", "Idéal, mais grâce pour le passé", "Un choix personnel", "Pas un enjeu moral pour moi"] },
  "INT-010": { q: "À quel point es-tu ouvert à partager entièrement ton passé sexuel avant le mariage ?", lo: "Je préfère garder mon passé privé", hi: "Totalement ouvert à ce sujet" },
  "LOYAL-003": { q: "Si l’un de nous lutte contre la tentation sexuelle ou la pornographie, que devrait-on faire ?", opts: ["Toujours se le dire", "Le dire à un mentor ou un partenaire de redevabilité", "Gérer ça en privé", "Pas sûr"] },
  "INT-012": { q: "À quel point l’affection et la complicité au quotidien sont-elles importantes pour toi ?", lo: "Pas un grand besoin", hi: "Très importantes" },

  // --- Conflict & Communication ---
  "CONF-001": { q: "Comment donnes-tu et reçois-tu l’amour le plus naturellement ?", opts: ["Les paroles valorisantes", "Le temps de qualité", "Les services rendus", "Les cadeaux", "Le contact physique"] },
  "CONF-002": { q: "À quelle vitesse aimes-tu résoudre un conflit ?", lo: "J’ai d’abord besoin d’espace", hi: "Le régler tout de suite" },
  "CONF-003": { q: "Classe ta façon de réagir sous stress, la plus proche de toi en premier.", opts: ["Me replier et me taire", "En parler", "Foncer seul", "Devenir irritable"] },
  "CONF-004": { q: "À quel point te sens-tu anxieux face au mariage ?", lo: "Parfaitement serein", hi: "Assez anxieux" },
  "LOYAL-004": { q: "À quel point nos réseaux sociaux devraient-ils être ouverts l’un à l’autre ?", lo: "Garder nos profils privés", hi: "Totalement ouverts l’un à l’autre" },
  "LOYAL-005": { q: "À quel point nos téléphones devraient-ils être ouverts l’un à l’autre ?", lo: "Les téléphones restent privés", hi: "Accès total l’un à l’autre" },
  "LOYAL-006": { q: "À quel point es-tu à l’aise avec des voyages en solo entre amis ?", lo: "Pas à l’aise", hi: "Tout à fait à l’aise" },
  "CONF-008": { q: "Classe ce qui te fait le plus sentir respecté.", opts: ["Être écouté", "La loyauté", "L’honnêteté", "Le soutien en public", "Mon indépendance"] },
  "CONF-009": { q: "Classe-les, du plus au moins, selon ta façon de donner et recevoir l’amour.", opts: ["Les paroles valorisantes", "Le temps de qualité", "Les services rendus", "Les cadeaux", "Le contact physique"] },
  "LOYAL-007": { q: "À quel point es-tu à l’aise avec des amitiés proches avec le sexe opposé après le mariage ?", lo: "Pas à l’aise", hi: "Tout à fait à l’aise" },
  "CONF-011": { q: "Classe ces styles de communication, du plus au moins proche de toi.", opts: ["Direct et droit au but", "Qui décortique en détail", "Silencieux et intérieur", "Expressif et bavard"] },
  "CONF-012": { q: "Quand tu dois soulever un problème, comment préfères-tu le faire ?", opts: ["Le régler tout de suite", "Attendre le bon moment", "L’écrire ou l’envoyer par message", "L’éviter jusqu’à ce que ça déborde"] },
  "CONF-013": { q: "Dans le feu du conflit, quel est ton réflexe ?", opts: ["Céder", "Me replier", "Pousser pour gagner", "Faire un compromis", "Le régler à fond"] },
  "CONF-014": { q: "À quel point gères-tu bien un « non » de ton partenaire ?", lo: "J’ai du mal avec ça", hi: "Je le prends facilement" },
  "CONF-015": { q: "Quelle part d’intimité personnelle est saine dans un mariage ?", lo: "Transparence totale", hi: "Beaucoup peut rester privé" },
  "CONF-016": { q: "Quelle dose de conflit te paraît normale et saine dans une relation ?", lo: "Presque aucune", hi: "Fréquent, c’est normal" },
  "CONF-017": { q: "À quel point veux-tu que l’ambiance de notre foyer soit calme ou dynamique ?", lo: "Calme et paisible", hi: "Animée et pleine d’énergie" },
  "CONF-018": { q: "À quel point t’emportes-tu vite ?", lo: "Très lent à la colère", hi: "Soupe au lait" },
  "CONF-019": { q: "Dans un désaccord, à quel point tiens-tu à avoir raison ?", lo: "Je préfère préserver la paix", hi: "Avoir raison compte pour moi" },
  "CONF-020": { q: "De combien de contact quotidien as-tu besoin pour te sentir connecté ?", opts: ["En continu tout au long de la journée", "Quelques prises de nouvelles", "Une fois par jour suffit", "On n’a pas besoin de contact quotidien"] },
  "CONF-021": { q: "Quand on te coupe la parole, comment réagis-tu d’habitude ?", opts: ["Je laisse passer", "J’attends, puis je reprends", "Je m’agace intérieurement", "Je réplique par-dessus"] },
  "CONF-022": { q: "Quand un conflit survient, à quel point prends-tu facilement ta part de responsabilité ?", lo: "Je me sens souvent lésé", hi: "J’assume vite ma part" },
  "CONF-023": { q: "Dans quelle mesure est-ce acceptable de parler de nos problèmes de couple avec des amis ou la famille ?", lo: "Que ça reste strictement entre nous", hi: "Ça va d’en parler avec d’autres" },
  "CONF-024": { q: "Ta façon de parler est-elle douce ou directe, surtout quand tu es frustré ?", lo: "Très douce", hi: "Très directe" },
  "CONF-025": { q: "À quel point est-ce important de protéger un temps régulier en tête-à-tête, aussi occupés soyons-nous ?", lo: "On se retrouvera quand on se retrouvera", hi: "On doit préserver un temps dédié" },
  "CONF-026": { q: "Quand on se dispute, est-ce juste de ressortir les erreurs passées ?", opts: ["Non, rester sur le sujet actuel", "Seulement si c’est directement pertinent", "Parfois, les schémas comptent", "Oui, le passé est de bonne guerre"] },
  "CONF-027": { q: "À quel point est-ce important qu’on se signale mutuellement nos angles morts ?", lo: "Mieux vaut laisser les choses", hi: "Très important" },
  "CONF-028": { q: "Les partenaires devraient-ils se signaler leurs angles morts ?", opts: ["Toujours, avec amour", "Seulement les gros", "Seulement quand on le demande", "Mieux vaut laisser faire"] },

  // --- In-Laws & Extended Family ---
  "INLAW-001": { q: "À quel point nos limites avec la famille élargie devraient-elles être fermes ?", lo: "Garder la famille très impliquée", hi: "Des limites fermes" },
  "INLAW-002": { q: "Comment gérer les fêtes entre nos deux familles ?", opts: ["Alterner équitablement chaque année", "Surtout tous ensemble", "Créer nos propres traditions", "Au feeling"] },
  "INLAW-003": { q: "Comment aborder la prise en charge des parents vieillissants ?", opts: ["Ils vivent avec nous si besoin", "On les soutient mais en logements séparés", "Partagé avec les frères et sœurs", "Je n’y ai pas réfléchi"] },
  "INLAW-004": { q: "À quel point es-tu prêt à faire passer ton conjoint avant tes parents ?", lo: "Ce serait difficile", hi: "Tout à fait prêt" },
  "INLAW-005": { q: "À quel point est-ce important pour toi que nos deux familles soutiennent notre relation ?", lo: "Pas important", hi: "Essentiel" },
  "INLAW-006": { q: "Dans quelle mesure tes parents influencent-ils tes décisions ?", lo: "Je décide en toute indépendance", hi: "Je m’appuie beaucoup sur eux" },
  "INLAW-007": { q: "En couple, dans quelle mesure devrait-on prendre les grandes décisions seuls plutôt qu’avec l’avis de nos parents ?", lo: "Seuls", hi: "Avec l’avis de nos parents" },

  // --- Fun & Icebreakers ---
  "FUN-002": { q: "Quelle est ta façon idéale de passer une journée libre ?", opts: ["Partir à l’aventure", "Bien au chaud à la maison", "Avec des amis", "À bricoler des projets"] },
  "FUN-006": { q: "Quelle part de ton temps libre veux-tu consacrer à tes propres loisirs plutôt qu’ensemble ?", lo: "Surtout ensemble", hi: "Beaucoup de temps indépendant" },

  // --- Deal-breakers ---
  "DEAL-001": { q: "Classe-les, du plus au moins rédhibitoire pour toi.", opts: ["La malhonnêteté", "Le manque de respect", "Une foi différente", "L’addiction", "L’infidélité", "La paresse"] },
  "DEAL-002": { q: "Classe tes incontournables chez un conjoint, le plus important en premier.", opts: ["La foi", "La bonté", "L’ambition", "L’humour", "La loyauté", "L’attirance", "Des objectifs communs"] },
  "DEAL-004": { q: "Pourrais-tu épouser quelqu’un qui ne partage pas ta foi ?", opts: ["Non, jamais", "Seulement s’il y était ouvert", "Oui, si on se respectait", "La foi n’est pas essentielle pour moi"] },
  "DEAL-005": { q: "Pourrais-tu rester avec quelqu’un devenu infidèle ?", opts: ["Non, c’est la fin", "J’essaierais de surmonter", "Ça dépendrait des circonstances", "Je pardonnerais et reconstruirais"] },
  "DEAL-006": { q: "À quel point une addiction grave serait-elle rédhibitoire pour toi ?", lo: "Je pourrais le surmonter", hi: "Absolument rédhibitoire" },
  "DEAL-007": { q: "Pourrais-tu épouser quelqu’un qui ne veut jamais d’enfants, alors que toi si ?", opts: ["Non, c’est rédhibitoire", "Il faudrait trouver un compromis", "Je pourrais y renoncer", "Je suis flexible sur les enfants"] },
  "DEAL-008": { q: "Un casier judiciaire serait-il rédhibitoire pour toi ?", opts: ["Oui, quel qu’il soit", "Ça dépend de quoi il s’agit", "Seulement les crimes violents", "Non, les gens peuvent changer"] },
  "DEAL-009": { q: "Pourrais-tu épouser quelqu’un que ta famille désapprouve fortement ?", opts: ["Non", "J’hésiterais beaucoup", "Oui, si j’en étais sûr", "L’avis de ma famille ne trancherait pas"] },

  // --- Health & Lifestyle ---
  "HEALTH-001": { q: "Où se situent tes habitudes alimentaires ?", lo: "Très axées santé", hi: "Tout ce qui est bon" },
  "HEALTH-002": { q: "À quelle fréquence aimes-tu voir tes amis — quel est ton rythme social idéal ?", opts: ["Rarement", "Quelques fois par mois", "Chaque semaine", "Plusieurs fois par semaine"] },
  "HEALTH-003": { q: "Que penses-tu des tatouages ?", lo: "Contre", hi: "J’adore" },
  "HEALTH-004": { q: "Quel est ton rapport à l’alcool, et à quoi voudrais-tu qu’il ressemble chez nous ?", opts: ["Je ne bois pas", "Occasionnellement / en société", "Régulièrement", "Je préférerais un foyer sans alcool"] },
  "HEALTH-005": { q: "Si tu remplissais un questionnaire de santé avec moi, que devrais-je savoir — passé et présent ?" },
  "HEALTH-006": { q: "Quel est ton passé et ton rapport actuel à l’alcool ou à d’autres substances ?" },
  "HEALTH-007": { q: "Quand tu es malade, comment veux-tu le plus être traité ?", opts: ["Qu’on me laisse me reposer", "Qu’on prenne soin de moi et me dorlote", "Qu’on prenne de mes nouvelles de loin", "Qu’on me tienne compagnie et me distraie"] },
  "HEALTH-008": { q: "Quelle part de ta journée passe aux écrans et au téléphone, et comment cela s’ajusterait-il dans un mariage ?", opts: ["Presque rien", "Une part modérée", "Beaucoup — c’est mon travail", "Plus que je ne le voudrais"] },
  "HEALTH-009": { q: "Es-tu couche-tard ou lève-tôt ?", lo: "Lève-tôt", hi: "Couche-tard" },
  "HEALTH-010": { q: "À quel point accordes-tu de l’importance à ton apparence et aux soins personnels ?", lo: "Peu exigeant", hi: "Très soucieux de ça" },

  // --- Past & Baggage ---
  "PAST-001": { q: "Y a-t-il quelque chose de ton passé que tu traverses ou dont tu guéris encore ?" },
  "PAST-002": { q: "Y a-t-il quelqu’un dans notre entourage avec qui tu as eu plus qu’une amitié et que je devrais connaître ?" },
  "PAST-003": { q: "Que t’ont appris tes relations passées qui feront de toi un meilleur partenaire aujourd’hui ?" },
  "PAST-004": { q: "Combien de « bagages » apportes-tu — et dans quelle taille ça rentre ?", opts: ["Une mallette", "Un bagage cabine", "Une grosse valise", "Une malle de voyage"] },
  "LOYAL-008": { q: "À quel point tes relations passées sont-elles pleinement closes ?", lo: "Je les digère encore", hi: "Pleinement closes" },
  "PAST-006": { q: "Choisis quelques mots pour ta relation avec chacun de tes parents — et raconte-moi l’histoire derrière." },
  "PAST-007": { q: "Y a-t-il quelque chose que tu aurais aimé dire à tes parents sans jamais l’avoir fait ?" },
  "PAST-008": { q: "À quoi ressemblait le foyer où tu as grandi ?", opts: ["Chaleureux et stable", "Strict", "Chaotique ou tendu", "Distant"] },
  "PAST-009": { q: "Quel a été le point le plus bas que tu aies traversé, et comment t’en es-tu sorti ?" },
  "PAST-010": { q: "Quels souvenirs d’enfance te façonnent encore aujourd’hui ?" },
  "PAST-011": { q: "As-tu travaillé sur tes blessures du passé avec un mentor, un conseiller ou dans le cadre d’un accompagnement ?", opts: ["Oui, en cours", "Oui, par le passé", "Non, mais j’y suis ouvert", "Non"] },

  // --- Career & Ambition ---
  "CAREER-001": { q: "À quel point l’ambition professionnelle est-elle centrale pour toi ?", lo: "Un emploi, c’est juste pour vivre", hi: "La carrière est centrale pour moi" },
  "CAREER-002": { q: "Raconte-moi les emplois que tu as occupés — ce que tu aimais, ce que tu n’aimais pas, et ce que ça dit de ta vie professionnelle." },
  "CAREER-003": { q: "À quel point es-tu prêt à déménager pour une opportunité d’emploi ?", lo: "Je veux poser mes racines", hi: "Tout à fait prêt à bouger" },
  "CAREER-004": { q: "Si nos carrières entraient en conflit, laquelle devrait primer ?", opts: ["Celle du mari", "Celle de la femme", "Celle qui rapporte le plus", "Celle qui passionne le plus", "On déciderait au cas par cas"] },
  "CAREER-005": { q: "Combien d’heures par semaine, c’est trop pour le travail ?", opts: ["Moins de 40", "40 à 50", "50 à 60", "Ce que le travail exige"] },
  "CAREER-006": { q: "À quel point est-ce important que ton travail ait du sens, plutôt que juste bien payer ?", lo: "Bien payer suffit", hi: "Il doit avoir du sens" },
  "CAREER-007": { q: "Accepterais-tu une baisse de salaire pour un meilleur cadre de vie ou plus de temps ensemble ?", lo: "Je tiendrais à conserver le revenu", hi: "Volontiers, pour une vie meilleure" },
  "CAREER-008": { q: "Que penses-tu du fait que l’un de nous prenne un gros risque professionnel, comme lancer une entreprise ?", lo: "Je préfère la stabilité", hi: "Je suis pour les risques audacieux" },
  "CAREER-009": { q: "Quand le travail et le temps en famille entrent en conflit, lequel devrait l’emporter d’habitude ?", lo: "La famille l’emporte presque toujours", hi: "Le travail doit parfois primer" },
  "CAREER-010": { q: "À quel âge aimerais-tu pouvoir prendre ta retraite ou ralentir ?", opts: ["Vers 50-55 ans ou avant", "Autour de 60 ans", "Vers 65 ans", "Je travaillerais aussi longtemps que possible"] },

  // --- Character & Self-Awareness ---
  "SELF-001": { q: "À quel point t’ouvres-tu facilement à quelqu’un ?", lo: "Sur mes gardes", hi: "Très ouvert" },
  "SELF-002": { q: "Si tu devais décrire qui tu es vraiment à quelqu’un qui ne t’a jamais rencontré, que dirais-tu ?" },
  "SELF-003": { q: "Donne cinq raisons pour lesquelles on adorerait partager sa vie avec toi — et trois raisons pour lesquelles ce pourrait être difficile." },
  "SELF-004": { q: "À quel point exprimes-tu facilement tes émotions ?", lo: "Elles restent enfermées en moi", hi: "Je les exprime facilement" },
  "SELF-005": { q: "Quelles sont deux habitudes que tu es content d’avoir, et deux dont tu aimerais te débarrasser ?" },
  "SELF-006": { q: "À quel point as-tu besoin de sentir que tu contrôles ?", lo: "Décontracté, je me laisse porter", hi: "J’ai besoin de contrôler" },
  "SELF-007": { q: "Quelles sont tes plus grandes peurs dans la vie en ce moment ?" },
  "SELF-008": { q: "Classe ce qui donne le plus de sens à ta vie.", opts: ["La foi", "La famille", "Le travail", "Les amis", "La croissance personnelle", "Servir les autres"] },
  "SELF-009": { q: "Quand on te fait un retour honnête, comment le prends-tu d’habitude ?", opts: ["Je l’accueille", "Je l’entends mais je me hérisse", "Je me mets sur la défensive", "Ça dépend de qui ça vient"] },
  "SELF-010": { q: "Avec quel genre de personnes accroches-tu instantanément, et lesquelles te demandent des efforts ?" },
  "SELF-011": { q: "Qui t’a le plus façonné, et de quelle manière ?" },
  "SELF-012": { q: "À quel point pardonnes-tu facilement ?", lo: "Je garde ça longtemps", hi: "Je pardonne vite" },
  "SELF-013": { q: "De combien de temps seul as-tu besoin pour te retrouver ?", lo: "Je me ressource entouré", hi: "J’ai besoin de beaucoup de solitude" },
  "SELF-014": { q: "Quels traits de caractère te viennent naturellement — patience, bonté, maîtrise de soi, douceur — et lesquels te demandent un vrai effort ?" },
  "SELF-015": { q: "Si tu pouvais changer une chose chez toi, laquelle serait-ce ?" },
  "SELF-016": { q: "Si je demandais à tes parents ce que je devrais vraiment savoir sur toi, que diraient-ils ?" },
  "SELF-017": { q: "Quand la vie devient dure, comment fais-tu face le plus souvent ?", opts: ["La prière ou l’Écriture", "En parler avec quelqu’un", "Rester actif ou faire du sport", "Me faire plaisir ou faire des achats", "Devenir silencieux et me replier"] },
  "SELF-018": { q: "À quel point prends-tu l’initiative plutôt que d’attendre qu’on te guide ?", lo: "J’ai tendance à attendre et à suivre", hi: "Je prends les devants et j’initie" },
  "SELF-019": { q: "Que penses-tu des petits « pieux mensonges » ?", opts: ["Jamais acceptables", "Acceptables pour ménager les sentiments", "Corrects à petite dose", "Pas grand-chose"] },
  "SELF-020": { q: "À quel point travailles-tu activement sur ta croissance et ton caractère en ce moment ?", lo: "Je n’y suis pas concentré", hi: "Je travaille activement sur moi" },
  "SELF-021": { q: "À quel point es-tu à l’aise d’avoir à rendre des comptes sur tes faiblesses ?", lo: "Je préfère les gérer en privé", hi: "Je veux qu’on me tienne pour responsable" },
  "SELF-022": { q: "À quel point gères-tu bien ton temps et tes responsabilités ?", lo: "Souvent désorganisé", hi: "Très organisé et au point" },
  "SELF-023": { q: "Pour une grande décision, sur quoi t’appuies-tu le plus ?", opts: ["La prière", "L’Écriture", "Un conseil avisé", "Mon propre jugement", "La recherche et la logique"] },
  "SELF-024": { q: "Dans quelle mesure tes amis influencent-ils tes choix et ta direction ?", lo: "Très peu", hi: "Énormément" },
  "SELF-025": { q: "Comment gères-tu les ragots dans les conversations du quotidien ?", opts: ["Je m’en éloigne", "J’écoute mais je ne les répands pas", "Je m’y joins parfois", "J’aime bien un bon ragot"] },
  "SELF-026": { q: "Agis-tu de la même façon avec tout le monde, ou différemment selon qui regarde ?", lo: "Je suis le même avec tout le monde", hi: "Je m’adapte beaucoup selon les gens" },
  "SELF-027": { q: "Quand tes sentiments et tes convictions s’opposent, lequel l’emporte d’habitude ?", lo: "Mes sentiments l’emportent souvent", hi: "Mes convictions l’emportent souvent" },

  // --- Us & Compatibility ---
  "US-001": { q: "Que signifie vraiment être « compatibles » pour toi ?" },
  "US-002": { q: "Qu’est-ce qui te dit que ce qu’on a est vraiment de l’amour et pas juste des sentiments forts ?" },
  "US-003": { q: "Nomme trois points communs et trois différences entre nous — lesquelles de ces différences chéris-tu vraiment ?" },
  "US-004": { q: "Que t’apporterait le mariage que le célibat ne t’apporterait pas ?" },
  "US-005": { q: "Oublie « parfait » — dépeins-moi ton image d’un mariage réaliste et formidable." },
  "US-006": { q: "Classe ce qui fait durer un mariage, le plus important en premier.", opts: ["La communication", "L’engagement", "Une foi partagée", "La confiance", "L’amitié", "L’intimité", "Des objectifs communs"] },
  "US-007": { q: "À quel point es-tu confiant qu’on irait jusqu’au bout ?", lo: "De vrais doutes", hi: "Totalement confiant" },
  "US-008": { q: "Qu’est-ce qui, chez moi, te rend fier ?" },
  "US-009": { q: "Comment garderais-tu la romance vivante sur le long terme ?" },
  "US-010": { q: "Quel mariage admires-tu, et que font-ils que tu voudrais pour nous ?" },
  "US-011": { q: "Qu’est-ce qui, chez moi, te fait hésiter ou t’inquiète en ce moment ?" },
  "US-012": { q: "Quelles expériences de vie espérerais-tu que ton futur conjoint ait vécues — et lesquelles espérerais-tu qu’il n’ait pas vécues ?" },
  "US-013": { q: "À quel point es-tu ouvert à un accompagnement prénuptial maintenant, et conjugal plus tard si besoin ?", opts: ["Tout à fait", "Si on en avait besoin", "J’hésiterais", "Pas sûr"] },
  "US-014": { q: "D’où vient l’essentiel de ce que tu crois sur le mariage ?", opts: ["Mes parents", "Les amis", "L’Église", "Les livres ou les médias", "Surtout en le découvrant moi-même"] },
  "US-015": { q: "Dans le mariage, pour quoi voudrais-tu qu’on s’appuie l’un sur l’autre — et qu’est-ce que tu garderais pour toi ?" },
  "US-016": { q: "Qu’as-tu toujours voulu me demander sans jamais l’avoir fait ?" },
  "US-017": { q: "Comment imagines-tu notre avenir à tous les deux ?" },
  "US-018": { q: "À quel point as-tu le sentiment de renoncer à toi-même pour être dans cette relation ?", lo: "Très peu", hi: "Énormément" },
  "US-019": { q: "Quelle bénédiction sur notre relation compte le plus pour toi ?", opts: ["Nos parents", "Un pasteur ou un mentor", "Des amis proches", "Notre groupe ou notre Église"] },
  "US-020": { q: "Dans quelle mesure le conseil avisé de personnes de confiance devrait-il façonner nos plus grandes décisions ?", lo: "On décide par nous-mêmes", hi: "Il nous façonne fortement" },
  "US-021": { q: "Pour choisir un partenaire de vie, qu’est-ce qui compte le plus pour toi ?", lo: "L’alchimie et le lien", hi: "La clarté et une direction commune" },
  "US-022": { q: "Dans quelle mesure un couple devrait-il s’accorder sur les grandes choses avant de se marier, plutôt que de régler ça plus tard ?", lo: "Régler l’essentiel plus tard", hi: "S’accorder d’abord sur les grandes choses" },
  "US-023": { q: "À quel point crois-tu que les habitudes et le caractère d’une personne peuvent changer après le mariage ?", lo: "Les gens changent rarement", hi: "Les gens peuvent beaucoup changer" },
  "US-024": { q: "À quel point comptes-tu sur le fait que je change après notre mariage ?", lo: "Pas du tout, je t’accepte tel que tu es", hi: "Je compte sur de vrais changements" },
  "US-025": { q: "Penses-tu que le mariage améliorera nos problèmes actuels, ou surtout les révélera ?", lo: "Le mariage aidera à arranger les choses", hi: "Le mariage révèle surtout ce qui est déjà là" },
  "US-026": { q: "Quand les saisons difficiles arrivent, comment penses-tu qu’on les traversera ?", opts: ["En nous appuyant sur Dieu ensemble", "En nous appuyant surtout l’un sur l’autre", "En avançant concrètement", "En cherchant de l’aide et des conseils"] },
  "US-027": { q: "Classe les signes de maturité pour le mariage, le plus important en premier.", opts: ["La maturité spirituelle", "La santé émotionnelle", "La stabilité financière", "La gestion des conflits", "L’autonomie de vie", "Une orientation professionnelle"] },
  "US-028": { q: "Vois-tu le mariage plutôt comme une alliance ou un contrat ?", opts: ["Une alliance sacrée devant Dieu", "Un engagement pour la vie", "Un partenariat qui peut prendre fin si nécessaire", "Pas sûr"] },
  "US-029": { q: "Que penses-tu du rythme auquel avance notre relation ?", lo: "Trop lent pour moi", hi: "Trop rapide pour moi (3 = parfait)" },
  "US-030": { q: "À quel point est-ce important pour toi que je m’entende avec tes amis les plus proches ?", lo: "Pas important", hi: "Essentiel" },
  "US-031": { q: "Une fois sûr que c’est le bon, dans combien de temps voudrais-tu te marier ?", opts: ["Dans l’année", "Un à deux ans", "Deux ans ou plus", "Aucune précipitation"] },
  "US-032": { q: "Classe ce qui devrait passer en premier dans notre vie commune.", opts: ["Dieu", "L’un l’autre", "Nos enfants", "Le travail et la carrière", "La famille élargie", "Le ministère et le service"] },
  "US-033": { q: "Quel est ton objectif pour cette période de fréquentation ?", opts: ["Aller vers le mariage", "Voir si on est compatibles", "En profiter pour l’instant", "Pas encore sûr"] },
  "US-034": { q: "Cette période devrait-elle être plutôt pour s’amuser ou pour évaluer sérieusement notre avenir ?", lo: "Surtout en profiter", hi: "L’évaluer sérieusement" },
  "US-035": { q: "À quel point est-ce important que ton conjoint soit aussi ton meilleur ami ?", lo: "La romance compte plus pour moi", hi: "Meilleurs amis avant tout" },
  "US-036": { q: "Au début d’une relation, à quel point protèges-tu ton cœur plutôt que de le donner entièrement ?", lo: "Je le protège soigneusement", hi: "Je donne mon cœur pleinement et vite" },
  "US-037": { q: "À quel point es-tu ouvert à ce que des proches remettent en question notre relation ?", lo: "Je préférerais qu’ils n’interviennent pas", hi: "J’accueille leurs questions honnêtes" },
  "US-038": { q: "Dans quelle mesure les partenaires devraient-ils se pousser à grandir, plutôt que de s’accepter tels qu’ils sont ?", lo: "S’accepter tels qu’on est", hi: "Se pousser activement à grandir" },
  "US-039": { q: "En couple, à quel point veux-tu t’impliquer dans la communauté ?", lo: "Surtout juste nous", hi: "Profondément impliqués dans la communauté" },
  "US-040": { q: "Avec quelle facilité renoncerais-tu à un loisir ou un engagement s’il nuisait à notre relation ?", lo: "Je serais réticent", hi: "Volontiers" },

  // --- Values & Convictions ---
  "VAL-001": { q: "Où te situes-tu sur l’avortement ?", opts: ["Toujours mal", "Mal, avec quelques exceptions", "Un choix personnel ou médical", "Je cherche encore"] },
  "VAL-002": { q: "Quelle est ta vision du mariage entre personnes de même sexe ?", opts: ["Mal", "Acceptable pour d’autres, pas pour nous", "Je le soutiens pleinement", "Je cherche encore"] },
  "VAL-003": { q: "Que penses-tu de la contraception ?", opts: ["L’éviter entièrement", "Méthodes naturelles seulement", "La plupart des méthodes conviennent", "Ce qui marche pour nous"] },
  "VAL-004": { q: "Dans quelles circonstances, s’il y en a, le divorce est-il acceptable pour toi ?", opts: ["Jamais", "Seulement en cas d’abus, d’adultère ou d’abandon", "Quand c’est irréparable", "Je cherche encore"] },
  "VAL-005": { q: "Quelle est ta vision de la peine de mort ?", opts: ["Je la soutiens", "Je m’y oppose", "Ça dépend du cas", "Pas sûr"] },
  "VAL-006": { q: "Voudrais-tu des armes à feu chez nous ?", opts: ["Oui, à l’aise", "Seulement si sécurisées / limitées", "Aucune arme", "Pas sûr"] },
  "VAL-007": { q: "Vers quoi penches-tu sur l’immigration ?", opts: ["Plus stricte", "Modérée", "Plus ouverte", "Pas sûr"] },
  "VAL-008": { q: "Quelle est ta vision de l’aide à mourir ?", opts: ["Mal", "Acceptable dans certains cas", "Un droit personnel", "Pas sûr"] },
  "VAL-009": { q: "Comment concilies-tu création et évolution — ou pas ?", opts: ["Création en six jours (terre jeune)", "Guidée par Dieu sur de longues périodes", "L’évolution, séparée de la foi", "J’explore encore"] },
  "VAL-010": { q: "Où te situes-tu sur les vaccins ?", opts: ["Pleinement pour", "Sélectif", "Réticent", "Contre"] },
  "VAL-011": { q: "À quel point est-ce important qu’on partage les mêmes convictions sociales et politiques ?", lo: "On peut diverger librement", hi: "On doit être d’accord" },
  "VAL-012": { q: "Que penses-tu de vivre ensemble avant le mariage ?", opts: ["Attendre le mariage", "Ok une fois fiancés", "Bien si on est engagés", "Aucun souci avec ça"] },
};

/** Deck name in the active language (English fallback). */
export function deckName(slug: string, lang: Lang): string {
  const en = DECKS[slug]?.name ?? slug;
  return lang === "fr" ? DECK_NAMES_FR[slug] ?? en : en;
}

/** A question with its user-facing text swapped to the active language. */
export function localizeQuestion(q: Question, lang: Lang): Question {
  if (lang !== "fr") return q;
  const f = Q_FR[q.id];
  if (!f) return q;
  return {
    ...q,
    q: f.q,
    opts: f.opts ?? q.opts,
    lo: f.lo ?? q.lo,
    hi: f.hi ?? q.hi,
  };
}
