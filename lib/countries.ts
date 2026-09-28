/** ISO 3166 country codes; names are produced in English by Intl.DisplayNames. The first few are pinned to the top. */
const pinned = ["NG", "GH", "KE", "ZA", "US", "GB", "CA"];
const others =
  "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE KP MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE UY UZ VU VA VE VN YE ZM ZW".split(
    " "
  );

export type Country = { code: string; name: string; flag: string };

let cache: Country[] | null = null;

function flagOf(code: string) {
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export function countries(): Country[] {
  if (cache) return cache;
  let nameOf = (code: string) => code;
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    nameOf = (code) => names.of(code) ?? code;
  } catch {
    /* very old browser: fall back to codes */
  }
  const make = (code: string): Country => ({ code, name: nameOf(code), flag: flagOf(code) });
  cache = [...pinned.map(make), ...others.map(make).sort((a, b) => a.name.localeCompare(b.name))];
  return cache;
}

/** Finds a country by its exact name, ignoring case and extra spaces. */
export function findCountry(name: string) {
  const q = name.trim().toLowerCase();
  return countries().find((c) => c.name.toLowerCase() === q);
}
