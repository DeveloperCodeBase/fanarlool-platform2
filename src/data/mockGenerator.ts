export type Factory = {
  id: string;
  nameFa: string;
  nameEn: string;
  benchmarkLabel: string;
};

export type ProductionLine = {
  id: string;
  factoryId: string;
  nameFa: string;
  nameEn: string;
  process: string;
  targetOee: number;
};

export type QCRecord = {
  id: string;
  factoryId: string;
  lineId: string;
  product: "A" | "B" | "C";
  shift: "A" | "B" | "C";
  timestamp: string;
  result: "pass" | "fail";
  defectClass?: string;
  measurements: {
    outerDiameter: number;
    freeLength: number;
    load: number;
  };
  modelVersion: string;
  recipeVersion: string;
};

export type OeeSample = {
  id: string;
  factoryId: string;
  lineId: string;
  date: string;
  plannedMinutes: number;
  runMinutes: number;
  idealCycleTime: number;
  totalCount: number;
  goodCount: number;
  scrapCount: number;
  downtimeMinutes: number;
  downtimeReason: string;
};

export type DowntimeEvent = {
  id: string;
  factoryId: string;
  lineId: string;
  minutes: number;
  reasonCode: string;
  timestamp: string;
  shift: "A" | "B" | "C";
};

export type EnergySample = {
  id: string;
  factoryId: string;
  date: string;
  electricityKw: number;
  electricityKwh: number;
  gasM3: number;
  airNm3h: number;
  pressureBar: number;
  flowM3Min: number;
};

export type Alert = {
  id: string;
  factoryId: string;
  severity: "low" | "medium" | "high";
  messageFa: string;
  messageEn: string;
  hint: string;
  module: "energy" | "qc" | "oee";
  timestamp: string;
};

export type ModelRegistryItem = {
  id: string;
  name: string;
  version: string;
  status: "Active" | "Staging";
  updatedAt: string;
  targetLines: string[];
};

export type Recipe = {
  id: string;
  product: string;
  version: string;
  cameraProfile: string;
  lighting: string;
  tolerance: {
    od: [number, number];
    length: [number, number];
    load: [number, number];
  };
};

export type Tariff = {
  carrier: "electricity" | "gas" | "air";
  unit: string;
  price: number;
};

export type Selection = {
  factoryId: string;
  range: "today" | "7d" | "30d";
  shift: "A" | "B" | "C";
  product: "A" | "B" | "C";
};

export type MockData = {
  factories: Factory[];
  lines: ProductionLine[];
  products: string[];
  qcRecords: QCRecord[];
  oee: OeeSample[];
  downtime: DowntimeEvent[];
  energy: EnergySample[];
  alerts: Alert[];
  models: ModelRegistryItem[];
  recipes: Recipe[];
  tariffs: Tariff[];
};

export type FilteredData = {
  qcRecords: QCRecord[];
  oee: OeeSample[];
  downtime: DowntimeEvent[];
  energy: EnergySample[];
  alerts: Alert[];
};

const seeded = (seed: number) => {
  let value = seed;
  return () => {
    const x = Math.sin(value++) * 10000;
    return x - Math.floor(x);
  };
};

const randRange = (rand: () => number, min: number, max: number) =>
  min + rand() * (max - min);

const createDate = (daysAgo: number, hour: number) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour);
  return d;
};

const factories: Factory[] = [
  {
    id: "fanarlool",
    nameFa: "کارخانه فنر لول ایران",
    nameEn: "Fanar Lool Iran",
    benchmarkLabel: "فَنَر لول"
  },
  {
    id: "member-a",
    nameFa: "کارخانه عضو A",
    nameEn: "Member Factory A",
    benchmarkLabel: "عضو A"
  },
  {
    id: "member-b",
    nameFa: "کارخانه عضو B",
    nameEn: "Member Factory B",
    benchmarkLabel: "عضو B"
  },
  {
    id: "member-c",
    nameFa: "کارخانه عضو C",
    nameEn: "Member Factory C",
    benchmarkLabel: "عضو C"
  }
];

const lineTemplates = [
  { nameFa: "خط ۱: پیچش فنر", nameEn: "Line 1: Coiling", process: "Coiling" },
  { nameFa: "خط ۲: عملیات حرارتی", nameEn: "Line 2: Heat Treatment", process: "Heat" },
  { nameFa: "خط ۳: سنگ زنی", nameEn: "Line 3: Grinding", process: "Grinding" },
  { nameFa: "خط ۴: بازرسی نهایی", nameEn: "Line 4: Final Inspection", process: "Inspection" }
];

export const generateMockData = (): MockData => {
  const rand = seeded(42);
  const lines: ProductionLine[] = factories.flatMap((f) =>
    lineTemplates.map((lt, idx) => ({
      id: `${f.id}-l${idx + 1}`,
      factoryId: f.id,
      nameFa: lt.nameFa,
      nameEn: lt.nameEn,
      process: lt.process,
      targetOee: 0.78 + rand() * 0.08
    }))
  );

  const products: Array<"A" | "B" | "C"> = ["A", "B", "C"];
  const qcRecords: QCRecord[] = [];
  const oee: OeeSample[] = [];
  const downtime: DowntimeEvent[] = [];
  const energy: EnergySample[] = [];
  const alerts: Alert[] = [];

  const recipes: Recipe[] = products.map((p, idx) => ({
    id: `recipe-${p}`,
    product: p,
    version: `v1.${idx + 1}`,
    cameraProfile: `Cam-${p}-${1 + idx}`,
    lighting: idx % 2 === 0 ? "5500K diffuse" : "6000K ring",
    tolerance: {
      od: [11.8 + idx * 0.3, 12.4 + idx * 0.3],
      length: [48 + idx * 2, 52 + idx * 2],
      load: [220 + idx * 10, 260 + idx * 10]
    }
  }));

  const models: ModelRegistryItem[] = [
    {
      id: "mdl-1",
      name: "SpringVision",
      version: "1.3.2",
      status: "Active",
      updatedAt: new Date().toISOString(),
      targetLines: lines.filter((l) => l.process === "Inspection").map((l) => l.id)
    },
    {
      id: "mdl-2",
      name: "DimensionNet",
      version: "1.1.0",
      status: "Staging",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      targetLines: lines.filter((l) => l.process !== "Inspection").map((l) => l.id)
    }
  ];

  const tariffs: Tariff[] = [
    { carrier: "electricity", unit: "kWh", price: 4500 },
    { carrier: "gas", unit: "m3", price: 1200 },
    { carrier: "air", unit: "Nm3", price: 900 }
  ];

  for (let day = 0; day < 32; day++) {
    factories.forEach((factory) => {
      const linesForFactory = lines.filter((l) => l.factoryId === factory.id);
      const baseLoad = factory.id === "fanarlool" ? 1.05 : 0.92 + rand() * 0.08;

      const electricityKwhDay = 2200 * baseLoad * (1 - day * 0.003 + rand() * 0.05);
      const gasDay = 980 * baseLoad * (1 - day * 0.002 + rand() * 0.04);
      const airDay = 610 * baseLoad * (1 - day * 0.002 + rand() * 0.03);
      energy.push({
        id: `${factory.id}-e-${day}`,
        factoryId: factory.id,
        date: createDate(day, 12).toISOString(),
        electricityKw: electricityKwhDay / 24,
        electricityKwh: electricityKwhDay,
        gasM3: gasDay,
        airNm3h: airDay / 24,
        pressureBar: 7.2 - rand() * 0.5,
        flowM3Min: 5.5 + rand() * 1.2
      });

      linesForFactory.forEach((line) => {
        const plannedMinutes = 22 * 60;
        const downtimeMinutes = 60 + rand() * 80;
        const runMinutes = plannedMinutes - downtimeMinutes;
        const idealCycleTime = 2.4 + rand() * 0.4;
        const totalCount = Math.round((runMinutes * 60) / idealCycleTime);
        const scrapRate = 0.02 + rand() * 0.03 + (line.process === "Inspection" ? 0.01 : 0);
        const scrapCount = Math.round(totalCount * scrapRate);
        const goodCount = totalCount - scrapCount;
        const reasonPool = ["mechanical_failure", "setup", "material_shortage", "quality_hold"];
        const downtimeReason = reasonPool[Math.floor(rand() * reasonPool.length)];

        oee.push({
          id: `${line.id}-oee-${day}`,
          factoryId: factory.id,
          lineId: line.id,
          date: createDate(day, 17).toISOString(),
          plannedMinutes,
          runMinutes,
          idealCycleTime,
          totalCount,
          goodCount,
          scrapCount,
          downtimeMinutes,
          downtimeReason
        });

        const shifts: Array<"A" | "B" | "C"> = ["A", "B", "C"];
        shifts.forEach((shift, idx) => {
          const product = products[idx % products.length];
          const samples = 6 + Math.floor(rand() * 4);
          for (let i = 0; i < samples; i++) {
            const timestamp = createDate(day, 6 + idx * 6 + i).toISOString();
            const od = 12 + randRange(rand, -0.2, 0.2);
            const length = 50 + randRange(rand, -1.5, 1.5);
            const load = 240 + randRange(rand, -15, 15);
            const pass =
              od >= 11.7 && od <= 12.5 && length >= 48 && length <= 52 && load >= 220 && load <= 260;
            const defectPool = ["surface_scratch", "coil_gap", "length_offset", "load_drift"];
            qcRecords.push({
              id: `${line.id}-qc-${day}-${shift}-${i}`,
              factoryId: factory.id,
              lineId: line.id,
              product,
              shift,
              timestamp,
              result: pass ? "pass" : "fail",
              defectClass: pass ? undefined : defectPool[Math.floor(rand() * defectPool.length)],
              measurements: {
                outerDiameter: Number(od.toFixed(2)),
                freeLength: Number(length.toFixed(2)),
                load: Number(load.toFixed(1))
              },
              modelVersion: models[0].version,
              recipeVersion: recipes.find((r) => r.product === product)?.version || "v1.0"
            });
          }
        });

        const downtimeEvents = 2 + Math.floor(rand() * 3);
        for (let k = 0; k < downtimeEvents; k++) {
          const mins = 10 + rand() * 45;
          downtime.push({
            id: `${line.id}-dt-${day}-${k}`,
            factoryId: factory.id,
            lineId: line.id,
            minutes: Number(mins.toFixed(1)),
            reasonCode: ["mechanical_failure", "setup", "material_shortage", "quality_hold"][
              Math.floor(rand() * 4)
            ],
            timestamp: createDate(day, 5 + k * 5).toISOString(),
            shift: ["A", "B", "C"][k % 3] as "A" | "B" | "C"
          });
        }
      });

      if (day % 3 === 0) {
        alerts.push({
          id: `${factory.id}-alert-${day}`,
          factoryId: factory.id,
          severity: day % 2 === 0 ? "high" : "medium",
          module: day % 2 === 0 ? "energy" : "qc",
          messageFa:
            day % 2 === 0
              ? "مشاهده افزایش مصرف کمپرسور و افت فشار - احتمال نشت هوا"
              : "انحراف طول فنر در خط ۳ نیازمند بازبینی مدل",
          messageEn:
            day % 2 === 0
              ? "Compressor power up with pressure drop - leak suspected"
              : "Spring length drift on Line 3 requires model review",
          hint:
            day % 2 === 0
              ? "بررسی شیر یکطرفه و اتصالات، فعال‌سازی حالت اکو در شیفت کم‌بار"
              : "Check recipe version and camera focus; consider rollback",
          timestamp: createDate(day, 9).toISOString()
        });
      }
    });
  }

  return {
    factories,
    lines,
    products,
    qcRecords,
    oee,
    downtime,
    energy,
    alerts,
    models,
    recipes,
    tariffs
  };
};

const rangeToDays = (range: Selection["range"]) => {
  if (range === "today") return 1;
  if (range === "7d") return 7;
  return 30;
};

export const filterMockData = (data: MockData, selection: Selection): FilteredData => {
  const days = rangeToDays(selection.range);
  const afterDate = new Date();
  afterDate.setHours(0, 0, 0, 0);
  afterDate.setDate(afterDate.getDate() - (days - 1));

  const byFactory = <T extends { factoryId: string }>(items: T[]) =>
    items.filter((i) => i.factoryId === selection.factoryId);

  const byTime = <T extends { timestamp?: string; date?: string }>(items: T[]) =>
    items.filter((i) => {
      const raw = "timestamp" in i ? i.timestamp : (i as any).date;
      const dt = new Date(raw as string);
      return dt >= afterDate;
    });

  const filterQc = data.qcRecords.filter(
    (r) =>
      r.factoryId === selection.factoryId &&
      r.product === selection.product &&
      r.shift === selection.shift &&
      new Date(r.timestamp) >= afterDate
  );

  const oee = byTime(byFactory(data.oee));
  const downtime = byTime(byFactory(data.downtime)).filter((d) => d.shift === selection.shift);
  const energy = byTime(byFactory(data.energy));
  const alerts = byTime(byFactory(data.alerts));

  return { qcRecords: filterQc, oee, downtime, energy, alerts };
};
