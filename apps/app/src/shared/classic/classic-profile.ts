export interface ClassicProfileData {
  /**
   * licentie jeugd
   */
  LJ: string;
  /**
   * licentie senioren
   */
  LS: string;
  /**
   * leeftijd categorie
   */
  age: string;
  /**
   * bonus punten
   */
  bonus: string;
  /**
   * rood, gele kaarten
   */
  cards: string;
  /**
   * huidige vereniging lidmatschaap
   */
  club_cur: string;
  /**
   * vorige clubs
   */
  club_old: string;
  /**
   * datum van profile
   */
  date: string;
  /**
   * foto bexist
   */
  foto: string;
  /**
   *  privacy string
   */
  gdpr: string;
  /**
   *  gender
   */
  gender: string;
  /**
   * initiele rating
   */
  ini_rat: string;
  /**
   * initiele rating jaar
   */
  ini_year: string;
  /**
   * kader funties
   */
  kader: string;
  /**
   * meer bondsnummers
   */
  merge: string;
  /**
   * naam
   */
  name: string;
  /**
   * para active
   */
  para: string;
  /**
   * rang positie
   */
  position: string;
  /**
   *  actuele rang
   */
  rang: string;
  /**
   * actuele rating positie
   */
  ranking: string;
  /**
   * rating
   */
  rating: string;
  /**
   *  email
   */
  email: string;
  /**
   *  is active referee
   */
  sr: number;
  /**
   *  is active wedstrijdsecretaris
   */
  ws: number;
  /**
   *  has ever play competition or turnament
   */
  has_results: number;
  /**
   *  has ever any funtion within NTTB
   */
  has_function: number;
}