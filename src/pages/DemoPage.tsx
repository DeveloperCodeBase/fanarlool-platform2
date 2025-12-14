import { ReactNode, useMemo, useState } from "react";
import clsx from "clsx";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import { useTranslation } from "react-i18next";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BatteryCharging,
  PieChart as PieChartIcon,
  FileText,
  Gauge,
  Monitor,
  Settings,
  Info,
  Menu,
  X
} from "lucide-react";
import { Sidebar } from "../components/ui/Sidebar";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Tabs } from "../components/ui/Tabs";
import { KpiCard } from "../components/ui/KpiCard";
import { Table } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { Drawer } from "../components/ui/Drawer";
import { useAppContext } from "../context/AppContext";
import { formatDateLabel, formatNumber, formatPercent } from "../utils/format";
import { OeeSample } from "../data/mockGenerator";

type ModuleKey = "overview" | "qc" | "oee" | "energy" | "benchmark" | "reports" | "admin";

const rangeToDays = (range: "today" | "7d" | "30d") => {
  if (range === "today") return 1;
  if (range === "7d") return 7;
  return 30;
};

const calcSampleOee = (s: OeeSample) => {
  const availability = s.runMinutes / s.plannedMinutes;
  const performance = (s.idealCycleTime * s.totalCount) / (s.runMinutes * 60);
  const quality = s.goodCount / s.totalCount;
  return { availability, performance, quality, oee: availability * performance * quality };
};

const ChartContainer = ({ children }: { children: ReactNode }) => (
  <div className="h-64 w-full">
    {children}
  </div>
);

const DemoPage = () => {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const {
    factories,
    selection,
    setSelection,
    filtered,
    data,
    language,
    isRTL
  } = useAppContext();
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview");
  const [selectedDowntime, setSelectedDowntime] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleModuleChange = (module: ModuleKey) => {
    setActiveModule(module);
    setSidebarOpen(false);
  };

  const factoryLines = useMemo(
    () => data.lines.filter((l) => l.factoryId === selection.factoryId),
    [data.lines, selection.factoryId]
  );

  const oeeAggregates = useMemo(() => {
    const perLine: Record<
      string,
      {
        samples: number;
        availability: number;
        performance: number;
        quality: number;
        oee: number;
        totalCount: number;
        goodCount: number;
        scrapCount: number;
        runMinutes: number;
        plannedMinutes: number;
      }
    > = {};
    filtered.oee.forEach((s) => {
      const metrics = calcSampleOee(s);
      if (!perLine[s.lineId]) {
        perLine[s.lineId] = {
          samples: 0,
          availability: 0,
          performance: 0,
          quality: 0,
          oee: 0,
          totalCount: 0,
          goodCount: 0,
          scrapCount: 0,
          runMinutes: 0,
          plannedMinutes: 0
        };
      }
      perLine[s.lineId].samples += 1;
      perLine[s.lineId].availability += metrics.availability;
      perLine[s.lineId].performance += metrics.performance;
      perLine[s.lineId].quality += metrics.quality;
      perLine[s.lineId].oee += metrics.oee;
      perLine[s.lineId].totalCount += s.totalCount;
      perLine[s.lineId].goodCount += s.goodCount;
      perLine[s.lineId].scrapCount += s.scrapCount;
      perLine[s.lineId].runMinutes += s.runMinutes;
      perLine[s.lineId].plannedMinutes += s.plannedMinutes;
    });

    const lineChartData = Object.entries(perLine).map(([lineId, agg]) => ({
      lineId,
      label: (factoryLines.find((l) => l.id === lineId)?.nameFa ||
        factoryLines.find((l) => l.id === lineId)?.nameEn ||
        lineId) as string,
      availability: agg.availability / agg.samples,
      performance: agg.performance / agg.samples,
      quality: agg.quality / agg.samples,
      oee: agg.oee / agg.samples,
      throughput: agg.totalCount,
      scrap: agg.scrapCount
    }));

    const totalRun = filtered.oee.reduce((sum, s) => sum + s.runMinutes, 0);
    const totalPlanned = filtered.oee.reduce((sum, s) => sum + s.plannedMinutes, 0);
    const totalCount = filtered.oee.reduce((sum, s) => sum + s.totalCount, 0);
    const goodCount = filtered.oee.reduce((sum, s) => sum + s.goodCount, 0);
    const avgIdeal = filtered.oee.reduce((sum, s) => sum + s.idealCycleTime, 0) / Math.max(filtered.oee.length, 1);

    const availability = totalRun / Math.max(totalPlanned, 1);
    const performance = (avgIdeal * totalCount) / (Math.max(totalRun, 1) * 60);
    const quality = goodCount / Math.max(totalCount, 1);

    const trendByDay: Record<string, { run: number; planned: number; total: number; good: number; ideal: number }> =
      {};
    filtered.oee.forEach((s) => {
      const label = formatDateLabel(s.date, language);
      if (!trendByDay[label]) trendByDay[label] = { run: 0, planned: 0, total: 0, good: 0, ideal: 0 };
      trendByDay[label].run += s.runMinutes;
      trendByDay[label].planned += s.plannedMinutes;
      trendByDay[label].total += s.totalCount;
      trendByDay[label].good += s.goodCount;
      trendByDay[label].ideal += s.idealCycleTime;
    });

    const trend = Object.entries(trendByDay).map(([day, v]) => {
      const availabilityDay = v.run / Math.max(v.planned, 1);
      const performanceDay = (v.ideal * v.total) / (Math.max(v.run, 1) * 60);
      const qualityDay = v.good / Math.max(v.total, 1);
      return { day, oee: availabilityDay * performanceDay * qualityDay };
    });

    return {
      lineChartData,
      overall: {
        availability,
        performance,
        quality,
        oee: availability * performance * quality,
        throughput: totalCount,
        good: goodCount
      },
      trend
    };
  }, [filtered.oee, factoryLines, language]);

  const downtimePareto = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.downtime.forEach((d) => {
      counts[d.reasonCode] = (counts[d.reasonCode] || 0) + d.minutes;
    });
    return Object.entries(counts)
      .map(([reason, minutes]) => ({ reason, minutes }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [filtered.downtime]);

  const downtimeScatter = useMemo(
    () =>
      filtered.downtime.map((d) => ({
        x: new Date(d.timestamp).getHours(),
        y: d.minutes,
        reason: d.reasonCode
      })),
    [filtered.downtime]
  );

  const energyTrend = useMemo(() => {
    const current = filtered.energy
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((e) => ({
        day: formatDateLabel(e.date, language),
        electricity: e.electricityKw,
        prev: 0
      }));
    const days = rangeToDays(selection.range);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - days - 1);
    const prev = data.energy
      .filter((e) => e.factoryId === selection.factoryId && new Date(e.date) >= start)
      .slice(0, current.length);
    current.forEach((row, idx) => {
      row.prev = prev[idx]?.electricityKw || row.electricity * 0.92 || 0;
    });
    return current;
  }, [filtered.energy, language, selection.range, selection.factoryId, data.energy]);

  const costBreakdown = useMemo(() => {
    const last = filtered.energy[filtered.energy.length - 1];
    const tariffMap = Object.fromEntries(data.tariffs.map((t) => [t.carrier, t.price]));
    const elec = (last?.electricityKwh || 0) * (tariffMap["electricity"] || 0);
    const gas = (last?.gasM3 || 0) * (tariffMap["gas"] || 0);
    const air = ((last?.airNm3h || 0) * 24) * (tariffMap["air"] || 0);
    return [
      { name: isFa ? "برق" : "Electricity", value: elec, color: "#2563eb" },
      { name: isFa ? "گاز" : "Gas", value: gas, color: "#f59e0b" },
      { name: isFa ? "هوای فشرده" : "Compressed Air", value: air, color: "#10b981" }
    ];
  }, [filtered.energy, data.tariffs, isFa]);

  const benchmarking = useMemo(() => {
    const days = rangeToDays(selection.range);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));
    const calcForFactory = (factoryId: string) => {
      const oees = data.oee.filter(
        (o) => o.factoryId === factoryId && new Date(o.date) >= start
      );
      const qc = data.qcRecords.filter(
        (q) => q.factoryId === factoryId && new Date(q.timestamp) >= start
      );
      const energy = data.energy.filter(
        (e) => e.factoryId === factoryId && new Date(e.date) >= start
      );
      const totalRun = oees.reduce((s, o) => s + o.runMinutes, 0);
      const totalPlanned = oees.reduce((s, o) => s + o.plannedMinutes, 0);
      const totalCount = oees.reduce((s, o) => s + o.totalCount, 0);
      const good = oees.reduce((s, o) => s + o.goodCount, 0);
      const availability = totalRun / Math.max(totalPlanned, 1);
      const performance =
        (oees.reduce((s, o) => s + o.idealCycleTime, 0) / Math.max(oees.length, 1) * totalCount) /
        (Math.max(totalRun, 1) * 60);
      const quality = good / Math.max(totalCount, 1);
      const oeeVal = availability * performance * quality;
      const defectRate =
        qc.length === 0 ? 0 : qc.filter((q) => q.result === "fail").length / qc.length;
      const energyIntensity =
        energy.reduce((s, e) => s + e.electricityKwh, 0) / Math.max(good, 1);
      return { oee: oeeVal, defectRate, energyIntensity };
    };

    const all = factories.map((f) => ({ ...calcForFactory(f.id), id: f.id, name: isFa ? f.nameFa : f.nameEn }));
    const provinceAvg = all
      .filter((f) => f.id !== "fanarlool")
      .reduce(
        (acc, f, _, arr) => ({
          oee: acc.oee + f.oee / arr.length,
          defectRate: acc.defectRate + f.defectRate / arr.length,
          energyIntensity: acc.energyIntensity + f.energyIntensity / arr.length
        }),
        { oee: 0, defectRate: 0, energyIntensity: 0 }
      );

    const lineRanking = factoryLines.map((line) => {
      const lineOees = data.oee.filter(
        (o) => o.lineId === line.id && new Date(o.date) >= start
      );
      const oeeScore =
        lineOees.reduce((s, o) => s + calcSampleOee(o).oee, 0) / Math.max(lineOees.length, 1);
      const qcLine = data.qcRecords.filter(
        (q) => q.lineId === line.id && new Date(q.timestamp) >= start
      );
      const defectRate = qcLine.length ? qcLine.filter((q) => q.result === "fail").length / qcLine.length : 0;
      return { line: isFa ? line.nameFa : line.nameEn, oee: oeeScore, defectRate };
    });

    return { factories: all, provinceAvg, lineRanking };
  }, [data, factories, selection.range, factoryLines, isFa]);

  const liveEnergy = filtered.energy[filtered.energy.length - 1];
  const tabs = [
    { key: "overview", label: t("demo.overview"), icon: <BarChart3 size={16} /> },
    { key: "qc", label: t("demo.qc"), icon: <Monitor size={16} /> },
    { key: "oee", label: t("demo.oee"), icon: <Gauge size={16} /> },
    { key: "energy", label: t("demo.energy"), icon: <BatteryCharging size={16} /> },
    { key: "benchmark", label: t("demo.benchmark"), icon: <PieChartIcon size={16} /> },
    { key: "reports", label: t("demo.reports"), icon: <FileText size={16} /> },
    { key: "admin", label: t("demo.admin"), icon: <Settings size={16} /> }
  ];

  const selectors = (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <select
        value={selection.factoryId}
        onChange={(e) => setSelection({ factoryId: e.target.value })}
        className="w-full min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-soft sm:w-auto"
      >
        {factories.map((f) => (
          <option key={f.id} value={f.id}>
            {isFa ? f.nameFa : f.nameEn}
          </option>
        ))}
      </select>
      <select
        value={selection.range}
        onChange={(e) => setSelection({ range: e.target.value as any })}
        className="w-full min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-soft sm:w-auto"
      >
        <option value="today">{t("demo.ranges.today")}</option>
        <option value="7d">{t("demo.ranges.week")}</option>
        <option value="30d">{t("demo.ranges.month")}</option>
      </select>
      <select
        value={selection.shift}
        onChange={(e) => setSelection({ shift: e.target.value as any })}
        className="w-full min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-soft sm:w-auto"
      >
        <option value="A">{t("demo.shifts.a")}</option>
        <option value="B">{t("demo.shifts.b")}</option>
        <option value="C">{t("demo.shifts.c")}</option>
      </select>
      <select
        value={selection.product}
        onChange={(e) => setSelection({ product: e.target.value as any })}
        className="w-full min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-soft sm:w-auto"
      >
        <option value="A">{t("demo.products.a")}</option>
        <option value="B">{t("demo.products.b")}</option>
        <option value="C">{t("demo.products.c")}</option>
      </select>
    </div>
  );

  const header = (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/80 bg-white/80 p-4 shadow-soft backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge tone="primary">{t("demoData")}</Badge>
          <div className="text-lg font-bold text-slate-900">{isFa ? "کنترل‌های سراسری دمو" : "Global demo controls"}</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Activity size={14} />
          {isFa ? "تمام نمودارها بر اساس انتخاب شما به‌روزرسانی می‌شوند." : "All visuals react to your selection."}
        </div>
      </div>
      {selectors}
    </div>
  );

  const overview = (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="OEE"
          value={formatPercent(oeeAggregates.overall.oee, language)}
          delta={isFa ? "OEE فرمول: دسترسی × کارایی × کیفیت" : "OEE = Availability × Performance × Quality"}
        />
        <KpiCard
          label={isFa ? "دسترسی" : "Availability"}
          value={formatPercent(oeeAggregates.overall.availability, language)}
          delta={isFa ? "زمان کارکرد / برنامه‌ریزی" : "Run time / planned"}
        />
        <KpiCard
          label={isFa ? "کیفیت" : "Quality"}
          value={formatPercent(oeeAggregates.overall.quality, language)}
          delta={isFa ? "نسبت قطعه سالم" : "Good / total"}
          tone="success"
        />
        <KpiCard
          label={isFa ? "مصرف برق امروز" : "Electricity today"}
          value={`${formatNumber(liveEnergy?.electricityKwh || 0, language, {
            maximumFractionDigits: 0
          })} kWh`}
          delta={isFa ? "داده نمایشی" : "Demo data"}
          tone="warning"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title={isFa ? "روند OEE" : "OEE trend"} className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info size={14} />
            {isFa ? "فرمول OEE = دسترسی × کارایی × کیفیت" : "OEE = Availability × Performance × Quality"}
          </div>
          <ChartContainer>
            <ResponsiveContainer>
              <LineChart data={oeeAggregates.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line dataKey="oee" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
        <Card title={isFa ? "هشدارها" : "Alerts"} subtitle={t("demoData")}>
          <div className="space-y-3">
            {filtered.alerts.slice(-4).map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <AlertTriangle size={14} className={a.severity === "high" ? "text-rose-500" : "text-amber-500"} />
                  {isFa ? a.messageFa : a.messageEn}
                </div>
                <div className="mt-1 text-xs text-slate-500">{a.hint}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const qcModule = (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card
        title={isFa ? "حجم بازرسی" : "Inspection volume"}
        subtitle={t("demoData")}
        actions={<Badge tone="neutral">{isFa ? "QC مرکزی" : "Central QC"}</Badge>}
      >
        <div className="flex gap-3 text-sm text-slate-600">
          <div className="rounded-xl bg-emerald-50 p-3 shadow-soft">
            <div className="text-xs text-slate-500">{isFa ? "قبولی" : "Pass"}</div>
            <div className="text-2xl font-bold text-emerald-600">
              {formatPercent(
                filtered.qcRecords.filter((r) => r.result === "pass").length /
                Math.max(filtered.qcRecords.length, 1),
                language
              )}
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 shadow-soft">
            <div className="text-xs text-slate-500">{isFa ? "ردی" : "Fail"}</div>
            <div className="text-2xl font-bold text-amber-600">
              {formatNumber(filtered.qcRecords.filter((r) => r.result === "fail").length, language)}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ChartContainer>
            <ResponsiveContainer>
              <BarChart data={downtimePareto}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="reason" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
      <Card title={isFa ? "جزئیات بر اساس شیفت و محصول" : "By shift and product"} subtitle={t("demoData")}>
        <Table headers={[isFa ? "شیفت" : "Shift", isFa ? "محصول" : "Product", isFa ? "نمونه" : "Samples", isFa ? "نرخ عیب" : "Defect rate"]}>
          {["A", "B", "C"].map((s) => {
            return ["A", "B", "C"].map((p) => {
              const subset = filtered.qcRecords.filter((r) => r.shift === s && r.product === p);
              const rate = subset.length ? subset.filter((r) => r.result === "fail").length / subset.length : 0;
              return (
                <tr key={`${s}-${p}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{s}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{p}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{formatNumber(subset.length, language)}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{formatPercent(rate, language)}</td>
                </tr>
              );
            });
          })}
        </Table>
      </Card>
    </div>
  );

  const oeeModule = (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Tabs
          items={tabs}
          active={activeModule}
          onChange={(k) => handleModuleChange(k as ModuleKey)}
          className="min-w-max"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="OEE"
          value={formatPercent(oeeAggregates.overall.oee, language)}
          delta={isFa ? "هدف خط: ۸۵٪" : "Line target: 85%"}
        />
        <KpiCard
          label={isFa ? "دسترسی" : "Availability"}
          value={formatPercent(oeeAggregates.overall.availability, language)}
          delta={isFa ? "OEE = A × P × Q" : "OEE = A × P × Q"}
        />
        <KpiCard
          label={isFa ? "کارایی" : "Performance"}
          value={formatPercent(oeeAggregates.overall.performance, language)}
          delta={isFa ? "چرخه ایده‌آل در دقیقه" : "Ideal cycle time per minute"}
          tone="success"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={isFa ? "ترند ۷/۳۰ روزه" : "7/30 day trend"}>
          <ChartContainer>
            <ResponsiveContainer>
              <LineChart data={oeeAggregates.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line dataKey="oee" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
        <Card title={isFa ? "A/P/Q به تفکیک خط" : "A/P/Q per line"}>
          <ChartContainer>
            <ResponsiveContainer>
              <BarChart data={oeeAggregates.lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="availability" stackId="apq" fill="#2563eb" name="A" />
                <Bar dataKey="performance" stackId="apq" fill="#10b981" name="P" />
                <Bar dataKey="quality" stackId="apq" fill="#f59e0b" name="Q" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title={isFa ? "پارتو توقفات" : "Downtime Pareto"}>
          <ChartContainer>
            <ResponsiveContainer>
              <BarChart data={downtimePareto}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="reason" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
        <Card title={isFa ? "پراکندگی توقف" : "Downtime scatter"}>
          <ChartContainer>
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Hour" />
                <YAxis type="number" dataKey="y" name="Minutes" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={downtimeScatter} fill="#2563eb" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
        <Card title={isFa ? "انتخاب کد توقف (نمایشی)" : "Assign downtime code (demo)"} subtitle={t("demoData")}>
          <Table headers={[isFa ? "زمان" : "Time", isFa ? "دلیل" : "Reason", isFa ? "مدت" : "Minutes", isFa ? "اقدام" : "Action"]}>
            {filtered.downtime.slice(0, 5).map((d) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-xs text-slate-600">{formatDateLabel(d.timestamp, language)}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{d.reasonCode}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{formatNumber(d.minutes, language)}</td>
                <td className="px-4 py-3">
                  <button
                    className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700"
                    onClick={() => setSelectedDowntime(d.id)}
                  >
                    {isFa ? "ویرایش" : "Edit"}
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
      <Modal
        open={!!selectedDowntime}
        onClose={() => setSelectedDowntime(null)}
        title={isFa ? "انتخاب دلیل توقف" : "Assign downtime reason"}
        actions={
          <button
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-soft"
            onClick={() => setSelectedDowntime(null)}
          >
            {isFa ? "ذخیره نمایشی" : "Save demo"}
          </button>
        }
      >
        <div className="space-y-3">
          <div className="text-sm text-slate-700">
            {isFa
              ? "این فرم نمایشی است. در استقرار واقعی، به CMMS یا MES متصل می‌شود."
              : "Demo form only. In production it connects to CMMS/MES."}
          </div>
          <select className="w-full rounded-xl border border-slate-200 p-2">
            <option>{isFa ? "خرابی مکانیکی" : "Mechanical failure"}</option>
            <option>{isFa ? "تنظیمات" : "Setup"}</option>
            <option>{isFa ? "کمبود مواد" : "Material shortage"}</option>
            <option>{isFa ? "کیفی/بازرسی" : "Quality hold"}</option>
          </select>
          <textarea
            className="h-24 w-full rounded-xl border border-slate-200 p-2"
            placeholder={isFa ? "یادداشت برای تیم تعمیرات..." : "Note for maintenance..."}
          />
        </div>
      </Modal>
    </div>
  );

  const energyModule = (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-5">
        <Card title={isFa ? "برق (kW)" : "Electricity (kW)"} className="md:col-span-1">
          <div className="text-2xl font-bold text-primary-700">
            {formatNumber(liveEnergy?.electricityKw || 0, language, { maximumFractionDigits: 1 })}
          </div>
          <div className="text-xs text-slate-500">{t("demoData")}</div>
        </Card>
        <Card title={isFa ? "برق امروز (kWh)" : "Electricity today (kWh)"} className="md:col-span-1">
          <div className="text-2xl font-bold text-primary-700">
            {formatNumber(liveEnergy?.electricityKwh || 0, language, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-500">{isFa ? "نمایشی" : "Demo only"}</div>
        </Card>
        <Card title={isFa ? "گاز (m3)" : "Gas (m3)"} className="md:col-span-1">
          <div className="text-2xl font-bold text-amber-700">
            {formatNumber(liveEnergy?.gasM3 || 0, language, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-500">{t("demoData")}</div>
        </Card>
        <Card title={isFa ? "هوای فشرده (Nm3/h)" : "Compressed air (Nm3/h)"} className="md:col-span-1">
          <div className="text-2xl font-bold text-emerald-700">
            {formatNumber(liveEnergy?.airNm3h || 0, language, { maximumFractionDigits: 1 })}
          </div>
          <div className="text-xs text-slate-500">
            {isFa ? `فشار ${liveEnergy?.pressureBar?.toFixed(1)} bar` : `Pressure ${liveEnergy?.pressureBar?.toFixed(1)} bar`}
          </div>
        </Card>
        <Card title={isFa ? "هشدار نشت" : "Leak suspicion"} className="md:col-span-1">
          <div className="text-sm text-slate-600">
            {isFa
              ? "مصرف کمپرسور + افت فشار → هشدار نشت احتمالی"
              : "Compressor power + pressure drop → leak suspected"}
          </div>
          <Badge tone="warning">{isFa ? "نمایشی" : "Demo"}</Badge>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title={isFa ? "ترند برق و مقایسه" : "Electricity trend vs previous"}>
          <ChartContainer>
            <ResponsiveContainer>
              <AreaChart data={energyTrend}>
                <defs>
                  <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="electricity" stroke="#2563eb" fill="url(#colorElec)" />
                <Area type="monotone" dataKey="prev" stroke="#94a3b8" fill="url(#colorPrev)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
        <Card title={isFa ? "تفکیک هزینه (نمایشی)" : "Cost breakdown (demo)"}>
          <ChartContainer>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={costBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
        <Card title={isFa ? "هدف کاهش ۱۰٪ مصرف برق خط ۳" : "Goal: -10% electricity Line 3"}>
          <div className="text-sm text-slate-600">
            {isFa
              ? "پیشرفت نسبت به دوره قبل"
              : "Progress vs previous period"}
          </div>
          <div className="mt-3 h-3 w-full rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-emerald-500" style={{ width: "68%" }} />
          </div>
          <div className="mt-2 text-xs text-emerald-600">{isFa ? "۶۸٪ پیشرفت نمایشی" : "68% demo progress"}</div>
        </Card>
      </div>
      <Card title={isFa ? "منطق کشف نشت (نمایشی)" : "Leak detection logic (demo)"} subtitle={t("demoData")}>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>{isFa ? "افزایش مصرف کمپرسور در حالت بیکاری + افت فشار → پرچم هشدار" : "Rising compressor power during standby + pressure drop → flag"}</li>
          <li>{isFa ? "تحلیل نرخ جریان هوای فشرده و همبستگی با تولید" : "Correlate compressed air flow with production"}</li>
          <li>{isFa ? "امکان اتصال به کنتور PowerLogic کلاس عمومی (بدون برند خاص)" : "Connect to generic power meters (e.g., PowerLogic class)"}</li>
        </ul>
      </Card>
    </div>
  );

  const benchmarkModule = (
    <div className="space-y-4">
      <Card title={isFa ? "مقایسه با میانگین استان" : "Compare with province average"} subtitle={t("demoData")}>
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label={isFa ? "OEE فنر لول" : "Fanar Lool OEE"}
            value={formatPercent(
              benchmarking.factories.find((f) => f.id === "fanarlool")?.oee || 0,
              language
            )}
            delta={isFa ? "استانی" : "Province"}
          />
          <KpiCard
            label={isFa ? "OEE میانگین استان" : "Province avg"}
            value={formatPercent(benchmarking.provinceAvg.oee, language)}
            delta={isFa ? "کارخانه‌های عضو" : "Member plants"}
          />
          <KpiCard
            label={isFa ? "شدت انرژی (kWh/قطعه سالم)" : "Energy intensity (kWh/good)"}
            value={formatNumber(
              benchmarking.factories.find((f) => f.id === "fanarlool")?.energyIntensity || 0,
              language,
              { maximumFractionDigits: 3 }
            )}
            delta={isFa ? "هدف کاهش" : "Reduction target"}
            tone="warning"
          />
        </div>
        <div className="mt-4">
          <ChartContainer>
            <ResponsiveContainer>
              <BarChart data={benchmarking.factories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="oee" name="OEE" fill="#2563eb" />
                <Bar dataKey="defectRate" name={isFa ? "نرخ عیب" : "Defect rate"} fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
      <Card title={isFa ? "رتبه خطوط" : "Line ranking"} subtitle={t("demoData")}>
        <Table headers={[isFa ? "خط" : "Line", "OEE", isFa ? "نرخ عیب" : "Defect rate"]}>
          {benchmarking.lineRanking
            .sort((a, b) => b.oee - a.oee)
            .map((row) => (
              <tr key={row.line} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.line}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{formatPercent(row.oee, language)}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{formatPercent(row.defectRate, language)}</td>
              </tr>
            ))}
        </Table>
      </Card>
    </div>
  );

  const reportsModule = (
    <div className="space-y-4">
      <Card title={isFa ? "خروجی" : "Exports"} subtitle={t("demoData")}>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-soft">
            CSV
          </button>
          <button className="rounded-full bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-soft">
            PDF
          </button>
          <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 shadow-soft">
            {isFa ? "چاپ" : "Print"}
          </button>
        </div>
        <div className="mt-3 text-xs text-slate-600">
          {isFa
            ? "خروجی نمایشی است. در نسخه عملی به سرویس گزارش‌گیری متصل می‌شود."
            : "Exports are demo-only; production uses real reporting service."}
        </div>
      </Card>
      <Card title={isFa ? "خلاصه ماهانه نمایشی" : "Monthly summary (demo)"} subtitle="PDF/Print">
        <div className="grid gap-3 md:grid-cols-3">
          <KpiCard label="OEE" value={formatPercent(oeeAggregates.overall.oee, language)} />
          <KpiCard label={isFa ? "نرخ عیب" : "Defect rate"} value="1.9%" tone="warning" />
          <KpiCard label={isFa ? "هزینه انرژی تخمینی" : "Estimated energy cost"} value="3.2B IRR" tone="primary" />
        </div>
        <div className="mt-4 h-64">
          <ChartContainer>
            <ResponsiveContainer>
              <AreaChart data={oeeAggregates.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="oee" stroke="#2563eb" fill="#c7d2fe" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );

  const adminModule = (
    <div className="space-y-4">
      <Card title={isFa ? "نقش‌ها (RBAC)" : "Roles (RBAC)"}>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <Badge tone="success">{isFa ? "Admin: انتشار مدل/Recipe" : "Admin: publish models/recipes"}</Badge>
          <Badge tone="primary">{isFa ? "Manager: اهداف OEE" : "Manager: OEE targets"}</Badge>
          <Badge tone="warning">{isFa ? "Operator: لیبل‌گذاری توقف" : "Operator: downtime labels"}</Badge>
        </div>
      </Card>
      <Card title={isFa ? "کاربران" : "Users"} subtitle={t("demoData")}>
        <Table headers={[isFa ? "نام" : "Name", isFa ? "نقش" : "Role", isFa ? "آخرین فعالیت" : "Last activity"]}>
          {[
            { name: "Operator A", role: isFa ? "اپراتور خط ۱" : "Line 1 operator" },
            { name: "QC Lead", role: isFa ? "سرگروه QC" : "QC Lead" },
            { name: "Energy Manager", role: isFa ? "مدیر انرژی" : "Energy manager" }
          ].map((u, idx) => (
            <tr key={u.name} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-semibold text-slate-900">{u.name}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{u.role}</td>
              <td className="px-4 py-3 text-xs text-slate-600">
                {formatDateLabel(new Date(Date.now() - idx * 3600 * 1000).toISOString(), language)}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
      <Card title={isFa ? "لاگ حسابرسی" : "Audit log"} subtitle={t("demoData")}>
        <Table headers={[isFa ? "کاربر" : "User", isFa ? "اقدام" : "Action", isFa ? "زمان" : "Time"]}>
          {[
            { u: "Admin", action: isFa ? "انتشار مدل SpringVision 1.3.2" : "Published model SpringVision 1.3.2" },
            { u: "QC Lead", action: isFa ? "آپدیت Tol فنر نوع B" : "Updated tolerance Spring B" },
            { u: "Energy", action: isFa ? "تنظیم هدف ۱۰٪" : "Set 10% target" }
          ].map((row, idx) => (
            <tr key={row.action} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.u}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{row.action}</td>
              <td className="px-4 py-3 text-xs text-slate-600">
                {formatDateLabel(new Date(Date.now() - idx * 7200 * 1000).toISOString(), language)}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );

  return (
    <div className="py-10 lg:py-12">
      <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Badge tone="primary">{t("demo.overview")}</Badge>
          <span className="text-sm font-semibold text-slate-700">
            {isFa ? "منوی ماژول‌ها" : "Modules menu"}
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl bg-white p-2 text-slate-700 shadow-soft"
          aria-label={isFa ? "باز کردن منو" : "Open menu"}
        >
          <Menu size={18} />
        </button>
      </div>
      <div
        className={clsx(
          "grid gap-4 lg:items-start",
          sidebarCollapsed
            ? "lg:grid-cols-[clamp(4.25rem,12vw,6.25rem)_1fr]"
            : "lg:grid-cols-[clamp(14rem,24vw,19rem)_1fr]"
        )}
      >
        <div className="relative hidden min-w-0 lg:block">
          <div className="sticky top-24">
            <Sidebar
              items={tabs}
              active={activeModule}
              onSelect={(k) => handleModuleChange(k as ModuleKey)}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
              title={isFa ? "داشبورد / داده / گزارش" : "Dashboard · Data · Reports"}
            />
          </div>
        </div>
        <div className="min-w-0 space-y-6">
          {header}
          {activeModule === "overview" && overview}
          {activeModule === "qc" && qcModule}
          {activeModule === "oee" && oeeModule}
          {activeModule === "energy" && energyModule}
          {activeModule === "benchmark" && benchmarkModule}
          {activeModule === "reports" && reportsModule}
          {activeModule === "admin" && adminModule}
        </div>
      </div>
      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={isFa ? "منوی دمو" : "Demo menu"}
        className="lg:hidden"
      >
        <Sidebar
          items={tabs}
          active={activeModule}
          onSelect={(k) => handleModuleChange(k as ModuleKey)}
          title={isFa ? "داشبورد / داده / گزارش" : "Dashboard · Data · Reports"}
        />
      </Drawer>
    </div >
  );
};

export default DemoPage;
