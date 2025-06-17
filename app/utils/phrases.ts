const phraseList = {
  0: [
    '„Du bist ein Feigling!“ – Grunt',
    '„Ich habe schon Goblins sterben sehen, die besser kämpften.“ – Raider',
    '„Jetzt verstehst du, warum wir trainieren.“ – Blademaster',
    '„Ihr kennt weder Geduld noch Weisheit.“ – Keeper of the Grove',
    '„Ihr seid eine Beleidigung für diesen Wald.“ – Dryad',
    '„So viel Zerstörung... durch Unwissenheit.“ – Druid of the Claw',
    '„Du dienst dem Tod... schlecht.“ – Death Knight',
    '„Selbst ein Ghul hätte besser geantwortet.“ – Ghoul',
    '„Eure Schwäche ekelt mich an.“ – Dreadlord',
    '„Das war beschämend!“ – Paladin',
    '„Ihr braucht dringend Training.“ – Footman',
    '„Nicht mal ein Lehrling würde so versagen.“ – Sorceress',
  ],
  1: [
    '„Noch ein paar Hiebe, dann wird’s vielleicht was.“ – Tauren',
    '„Du hast überlebt. Respekt... so halb.“ – Spirit Walker',
    '„Du bist nicht völlig nutzlos.“ – Witch Doctor',
    '„Der Pfad ist gewählt, wenn auch holprig.“ – Priestess of the Moon',
    '„Die Natur ist gnädig. Noch.“ – Archer',
    '„Du atmest mit dem Wald. Langsam.“ – Huntress',
    '„Ein Hauch von Potenzial... fast.“ – Lich',
    '„Du hast überlebt? Wie enttäuschend.“ – Crypt Fiend',
    '„Sterben wäre eine Verbesserung.“ – Banshee',
    '„Der Wille ist da... das Wissen fehlt.“ – Priest',
    '„Fast ein Treffer.“ – Rifleman',
    '„Du brauchst nur... Übung.“ – Archmage',
  ],
  2: [
    '„Du kämpfst mit Ehre.“ – Tauren Chieftain',
    '„Nicht schlecht für einen Grünhaut.“ – Blademaster',
    '„Du bist bereit für den nächsten Kampf.“ – Far Seer',
    '„Deine Bewegungen sind flink und präzise.“ – Warden',
    '„Der Mond segnet dich mit Klarheit.“ – Priestess of the Moon',
    '„Du bist eins mit dem Wald.“ – Druid of the Talon',
    '„Du bist brauchbar.“ – Death Knight',
    '„Noch nicht perfekt... aber du lernst.“ – Necromancer',
    '„Du bist kein völliger Abfall.“ – Abomination',
    '„Ein weiterer Sieg für die Allianz.“ – Knight',
    '„Du bist würdig, Seite an Seite zu kämpfen.“ – Paladin',
    '„Nicht perfekt, aber ehrenvoll.“ – Footman',
  ],
  3: [
    '„Ein wahrer Krieger der Horde!“ – Grunt',
    '„Deine Klinge ist schnell und tödlich.“ – Blademaster',
    '„Du bist der Sturm!“ – Far Seer',
    '„Anmut und Präzision – perfekt vereint.“ – Archer',
    '„Die Göttin ist stolz auf dich.“ – Priestess of the Moon',
    '„Du bewegst dich wie ein Schatten des Zorns.“ – Warden',
    '„So spricht der wahre Diener des Lichkönigs.“ – Lich',
    '„Deine Macht ist beeindruckend.“ – Dreadlord',
    '„Der Tod grüßt dich mit Stolz.“ – Death Knight',
    '„Du kämpfst mit Weisheit und Mut.“ – Archmage',
    '„Das Königreich wäre stolz auf dich.“ – Paladin',
    '„Ein Held für das Licht!“ – Priest',
  ],
}

export function getRandomPhrase(points: 0 | 1 | 2 | 3) {
  const phrases = phraseList[points] ?? []
  const i = Math.floor(Math.random() * (phrases.length + 1))
  return phrases[i]
}
