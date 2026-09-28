/** ISO 3166 country codes; names are produced in English by Intl.DisplayNames. */
const codes =
  "NG GH KE ZA US GB CA AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE KP MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE UY UZ VU VA VE VN YE ZM ZW".split(
    " "
  );

let cache: string[] | null = null;

export function countryNames(): string[] {
  if (cache) return cache;
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    const first = codes.slice(0, 7).map((c) => names.of(c) ?? c);
    const rest = codes
      .slice(7)
      .map((c) => names.of(c) ?? c)
      .sort((a, b) => a.localeCompare(b));
    cache = [...first, ...rest];
  } catch {
    cache = [];
  }
  return cache;
}
