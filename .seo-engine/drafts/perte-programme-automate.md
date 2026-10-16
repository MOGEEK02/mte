---
slug: perte-programme-automate
lang: fr
pillar: plc-programming
title: "Programme d'automate perdu : comment le récupérer ou le réécrire"
description: "Programme d'automate (PLC) perdu ? Voici comment le récupérer depuis l'automate ou le réécrire, et comment éviter que ça se reproduise. MTE, Algérie."
primary_keyword: "récupérer programme automate"
secondary_keywords: ["programme PLC perdu", "sauvegarde automate Siemens", "réécrire programme automate"]
status: human-review   # NE PAS publier sans relecture
author: "MTE Industrial Electronics"
date: 2026-10-16
internal_links:
  pillar: "/#services"
  tools: "/outils"
  related: ["/programmation-automate-blida", "/programmation-automate-alger", "/programmation-automate-medea"]
cta: "WhatsApp + devis gratuit"
---

# Programme d'automate perdu : comment le récupérer ou le réécrire

Votre machine fonctionne, mais le fichier source du programme a disparu : la personne qui l'avait fait est partie, le PC d'origine est en panne, ou personne ne sait où est la sauvegarde. Le jour où il faut modifier la machine — ou qu'elle tombe en panne — ce programme devient introuvable. C'est l'une des situations les plus fréquentes que nous rencontrons dans les usines en Algérie.

**La réponse courte :** dans beaucoup de cas, le programme peut être **lu directement dans l'automate** (s'il n'est pas protégé). Quand ce n'est pas possible, on le **réécrit** à partir du fonctionnement réel de la machine. Dans les deux cas, vous repartez avec une **sauvegarde documentée** pour ne plus jamais dépendre d'une seule copie.

## 1. Récupérer le programme depuis l'automate

La première chose à tenter : transférer le programme depuis la mémoire de l'automate vers un PC (opération dite *upload*). C'est possible sur la plupart des marques :

- **Siemens** — S7-1200 / S7-1500 (TIA Portal), S7-300 / S7-400 (Step 7), LOGO!
- **Schneider** — Modicon (EcoStruxure / Unity), Zelio
- **Omron**, **Fatek**, **Delta**, **Mitsubishi**

Deux points importants à connaître :

- **Les commentaires et les noms de variables ne sont pas toujours stockés dans l'automate.** Sur un S7-300 / S7-400, par exemple, on récupère la logique (les blocs), mais souvent sans les commentaires : le programme est **fonctionnel**, mais moins lisible. Sur les automates récents (S7-1200 / S7-1500), le projet complet peut être conservé dans la CPU ou sur la carte mémoire, et donc récupéré tel quel.
- **Une protection peut bloquer la lecture.** Mot de passe, *know-how protection*, blocs verrouillés : si l'automate est protégé, l'upload peut être partiel ou impossible. On évalue ça au cas par cas.

## 2. Si le programme est protégé, corrompu ou illisible

Quand la lecture directe échoue, il reste des solutions :

- **Vérifier les sauvegardes existantes** : ancienne clé USB, carte mémoire, e-mail du fournisseur, PC de l'atelier. Une copie oubliée fait parfois gagner des jours.
- **Contacter le constructeur de la machine** (OEM) : il possède parfois encore le programme d'origine.
- **Réécrire le programme** à partir du fonctionnement de la machine (voir ci-dessous).

## 3. Réécrire le programme à partir de la machine

C'est ce qu'on appelle la **rétro-ingénierie fonctionnelle**. Le principe : comprendre ce que fait la machine, puis reconstruire le programme qui produit ce comportement.

Concrètement :

1. **Relever les entrées / sorties** : capteurs (détecteurs, fins de course, pressostats), actionneurs (moteurs, vérins, électrovannes), sécurités.
2. **Observer les séquences** : dans quel ordre la machine travaille, les temporisations, les conditions de démarrage et d'arrêt.
3. **Écrire et tester** le nouveau programme, étape par étape, avec vos opérateurs, jusqu'à retrouver le fonctionnement d'origine — souvent avec quelques améliorations au passage.

Le temps nécessaire dépend de la complexité de la machine : une petite machine se traite en quelques jours, une ligne complète demande plus de préparation.

## Et l'écran IHM ?

Le même raisonnement s'applique à l'**écran opérateur (IHM)** : on récupère son application quand c'est possible, ou on la reconstruit (pages, alarmes, recettes) et on la relie à l'automate. [Voir nos services de programmation PLC et IHM](/#services).

## Évitez que ça se reproduise : la sauvegarde

Une fois le programme récupéré ou réécrit, la vraie protection, c'est la **sauvegarde** :

- Gardez le **fichier source** (pas seulement la version compilée) et une courte **documentation** (liste des entrées/sorties, schéma).
- Conservez une copie **hors de la machine** (clé + cloud ou autre PC).
- Notez la **version** et la date à chaque modification.

C'est exactement ce que nous remettons après chaque intervention : un programme sauvegardé et documenté, pour que vous ne dépendiez plus d'une seule copie ni d'une seule personne.

## Comment MTE peut vous aider

Nous programmons et récupérons les automates **Siemens, Schneider, Omron, Fatek, Delta et Mitsubishi**, ainsi que leurs écrans IHM. Selon votre cas, nous **lisons le programme dans l'automate**, le **réécrivons** à partir de la machine, puis nous vous remettons une **sauvegarde documentée**. Diagnostic sous 24 à 48 h, devis gratuit avant toute intervention, sur site partout en Algérie ou en atelier à Médéa.

👉 **Programme perdu ou machine à modifier ?** Envoyez-nous le modèle de l'automate et une photo de l'armoire sur WhatsApp — nous vous disons rapidement ce qui est récupérable.

## Questions fréquentes

**Peut-on récupérer un programme protégé par mot de passe ?**
Pas toujours : cela dépend du type de protection. Certaines sont contournables légitimement avec le bon outil, d'autres non. Nous évaluons votre automate au cas par cas avant de vous dire ce qui est possible.

**Combien de temps faut-il pour réécrire un programme ?**
Le diagnostic est fait sous 24 à 48 h. La réécriture dépend ensuite de la complexité : de quelques jours pour une petite machine à plus pour une ligne complète.

**Faut-il arrêter la production ?**
La lecture du programme peut souvent se faire sans tout démonter. Pour une réécriture, des essais sont nécessaires : on les planifie avec vous pour limiter l'arrêt.

**Vous récupérez quelles marques d'automates ?**
Siemens (S7-200/300/1200/1500, LOGO!), Schneider (Modicon, Zelio), Omron, Fatek, Delta et Mitsubishi, avec leurs écrans IHM.
