import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Archive, BookOpen, CheckCircle2, Info, Layers } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Table } from "../components/ui/Table";
import { Drawer } from "../components/ui/Drawer";
import { KpiCard } from "../components/ui/KpiCard";
import { formatDateLabel, formatNumber, formatPercent } from "../utils/format";
import { QCRecord } from "../data/mockGenerator";

const PlatformPage = () => {
  const { filtered, data, language } = useAppContext();
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const [selected, setSelected] = useState<QCRecord | null>(null);

  const totalInspections = filtered.qcRecords.length;
  const pass = filtered.qcRecords.filter((r) => r.result === "pass").length;
  const fail = totalInspections - pass;

  const pareto = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.qcRecords.forEach((r) => {
      if (r.result === "fail" && r.defectClass) {
        counts[r.defectClass] = (counts[r.defectClass] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([k, v]) => ({ defect: k, count: v }))
      .sort((a, b) => b.count - a.count);
  }, [filtered.qcRecords]);

  const trend = useMemo(() => {
    const byDay: Record<string, { pass: number; fail: number }> = {};
    filtered.qcRecords.forEach((r) => {
      const label = formatDateLabel(r.timestamp, language);
      if (!byDay[label]) byDay[label] = { pass: 0, fail: 0 };
      byDay[label][r.result === "pass" ? "pass" : "fail"] += 1;
    });
    return Object.entries(byDay).map(([day, counts]) => ({
      day,
      pass: counts.pass,
      fail: counts.fail
    }));
  }, [filtered.qcRecords, language]);

  const linesLookup = useMemo(() => {
    const map: Record<string, string> = {};
    data.lines.forEach((l) => {
      map[l.id] = isFa ? l.nameFa : l.nameEn;
    });
    return map;
  }, [data.lines, isFa]);

  return (
    <div className="space-y-8 py-10">
      <div className="flex flex-col gap-2">
        <Badge tone="primary">{t("demoData")}</Badge>
        <h1 className="text-3xl font-black text-slate-900">{t("platform.title")}</h1>
        <p className="text-sm text-slate-600">
          {isFa
            ? "مدیریت متمرکز مدل‌ها، دستورالعمل‌ها، ذخیره‌سازی QC و ردیابی برای کارخانه فنر لول ایران و اعضای پارک علم و فناوری سمنان."
            : "Central model, recipe, QC storage and traceability for Fanar Lool factory and member plants."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label={isFa ? "حجم بازرسی" : "Inspection volume"}
          value={formatNumber(totalInspections, language, { maximumFractionDigits: 0 })}
          delta={isFa ? "داده نمایشی" : "Demo data"}
        />
        <KpiCard
          label={isFa ? "نرخ قبولی" : "Pass rate"}
          value={formatPercent(pass / Math.max(totalInspections, 1), language)}
          delta={`${formatNumber(fail, language)} ${isFa ? "ردی" : "fails"}`}
          tone="success"
        />
        <KpiCard
          label={isFa ? "مدل فعال" : "Active model"}
          value={data.models[0].version}
          delta={data.models[0].name}
          tone="primary"
        />
        <KpiCard
          label={isFa ? "ردیابی و لاگ" : "Traceability"}
          value={formatNumber(filtered.qcRecords.filter((r) => r.result === "fail").length, language)}
          delta={isFa ? "تمام رخدادها ثبت شده" : "Events recorded"}
          tone="warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          title={t("platform.modelRegistry")}
          subtitle={isFa ? "مدیریت نسخه، انتشار، Rollback (نمایشی)" : "Versioning, publish, rollback demo"}
          actions={<Badge tone="neutral">{t("demoData")}</Badge>}
          className="lg:col-span-2"
        >
          <Table headers={[isFa ? "مدل" : "Model", isFa ? "نسخه" : "Version", isFa ? "وضعیت" : "Status", isFa ? "خطوط هدف" : "Target lines", isFa ? "به‌روزرسانی" : "Updated"]}>
            {data.models.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">{m.name}</td>
                <td className="px-4 py-3 text-slate-600">{m.version}</td>
                <td className="px-4 py-3">
                  <Badge tone={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{m.targetLines.length}</td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDateLabel(m.updatedAt, language)}
                  <div className="mt-1 flex gap-2 text-xs text-primary-600">
                    <button className="rounded-full bg-primary-50 px-2 py-1">{isFa ? "انتشار" : "Publish"}</button>
                    <button className="rounded-full bg-amber-50 px-2 py-1">{isFa ? "بازگشت" : "Rollback"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card title={t("platform.inspectionRecipes")} subtitle={isFa ? "مدیریت Tol/Camera" : "Tolerances and camera"} className="lg:col-span-1">
          <div className="space-y-3">
            {data.recipes.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>{isFa ? `فنر نوع ${r.product}` : `Spring ${r.product}`}</span>
                  <Badge tone="neutral">{r.version}</Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>{isFa ? `پروفایل دوربین: ${r.cameraProfile}` : `Camera: ${r.cameraProfile}`}</div>
                  <div>{isFa ? `نور: ${r.lighting}` : `Light: ${r.lighting}`}</div>
                  <div>{isFa ? `قطر: ${r.tolerance.od.join(" - ")}` : `OD: ${r.tolerance.od.join(" - ")}`}</div>
                  <div>{isFa ? `طول: ${r.tolerance.length.join(" - ")}` : `Length: ${r.tolerance.length.join(" - ")}`}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title={isFa ? "پارتو عیوب" : "Defect Pareto"} className="lg:col-span-1">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={pareto}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="defect" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title={isFa ? "روند قبولی/ردی" : "Pass/Fail trend"} className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line dataKey="pass" stroke="#22c55e" strokeWidth={2} />
                <Line dataKey="fail" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card
        title={t("platform.traceability")}
        subtitle={isFa ? "کلیک برای جزئیات" : "Click for details"}
        actions={<Badge tone="neutral">{isFa ? "داده نمایشی QC" : "QC demo data"}</Badge>}
      >
        <Table
          headers={[
            isFa ? "شناسه" : "ID",
            isFa ? "زمان" : "Timestamp",
            isFa ? "خط" : "Line",
            isFa ? "محصول" : "Product",
            isFa ? "نتیجه" : "Result",
            isFa ? "عیب" : "Defect"
          ]}
        >
          {filtered.qcRecords.slice(0, 12).map((r) => (
            <tr
              key={r.id}
              className="cursor-pointer hover:bg-primary-50/50"
              onClick={() => setSelected(r)}
            >
              <td className="px-4 py-3 text-xs text-slate-600">{r.id}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{formatDateLabel(r.timestamp, language)}</td>
              <td className="px-4 py-3 text-sm font-semibold text-slate-900">{linesLookup[r.lineId]}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{r.product}</td>
              <td className="px-4 py-3">
                <Badge tone={r.result === "pass" ? "success" : "warning"}>
                  {r.result === "pass" ? (isFa ? "قبول" : "Pass") : isFa ? "رد" : "Fail"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-slate-600">{r.defectClass || "-"}</td>
            </tr>
          ))}
        </Table>
      </Card>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${isFa ? "جزئیات بازرسی" : "Inspection detail"} ${selected.id}` : ""}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="text-emerald-500" size={16} />
              <span>{isFa ? "تصمیم" : "Decision"}:</span>
              <Badge tone={selected.result === "pass" ? "success" : "warning"}>
                {selected.result === "pass" ? (isFa ? "قبول" : "Pass") : isFa ? "رد" : "Fail"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["تصویر ۱", "تصویر ۲", "ROI", "Heatmap"].map((label) => (
                <div
                  key={label}
                  className="h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500"
                >
                  {isFa ? "جایگزین تصویر" : "Image placeholder"}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="font-semibold text-slate-900">{isFa ? "اندازه‌گیری" : "Measurements"}</div>
                <ul className="mt-2 space-y-1">
                  <li>OD: {selected.measurements.outerDiameter} mm</li>
                  <li>{isFa ? "طول آزاد" : "Free length"}: {selected.measurements.freeLength} mm</li>
                  <li>{isFa ? "نیرو" : "Load"}: {selected.measurements.load} N</li>
                </ul>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="font-semibold text-slate-900">{isFa ? "نسخه‌های استفاده شده" : "Versions used"}</div>
                <ul className="mt-2 space-y-1">
                  <li>{isFa ? "مدل" : "Model"}: {selected.modelVersion}</li>
                  <li>{isFa ? "Recipe" : "Recipe"}: {selected.recipeVersion}</li>
                  <li>{isFa ? "خط" : "Line"}: {linesLookup[selected.lineId]}</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg border border-primary-100 bg-primary-50 p-3 text-xs text-primary-800">
              <div className="flex items-center gap-2 font-semibold">
                <Info size={14} /> {t("demoData")}
              </div>
              <p className="mt-1">
                {isFa
                  ? "اطلاعات صرفاً برای نمایش است. اتصال واقعی از طریق OPC UA / MQTT / Modbus قابل انجام است."
                  : "Information shown is demo-only. Real connections via OPC UA / MQTT / Modbus can be wired."}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title={t("platform.storage")}
          subtitle={isFa ? "Lakehouse کیفیت" : "Quality lakehouse"}
          actions={<Badge tone="primary">Object + Parquet</Badge>}
        >
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Archive size={16} />
              {isFa ? "ذخیره تصویر، سیگنال و Metadata" : "Store images, signals, metadata"}
            </div>
            <div className="flex items-center gap-2">
              <Layers size={16} />
              {isFa ? "دسته‌بندی عیوب و Taxonomy مشترک" : "Shared defect taxonomy"}
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              {isFa ? "ردیابی تغییرات Recipe و مدل" : "Recipe & model lineage"}
            </div>
          </div>
        </Card>
        <Card
          title={t("platform.detail")}
          subtitle={isFa ? "Drawer جزئیات" : "Detail drawer"}
          actions={<Badge tone="warning">{t("demoData")}</Badge>}
        >
          <p className="text-sm text-slate-600">
            {isFa
              ? "نمایش همزمان تصویر، اندازه‌گیری و تصمیم برای هر شناسه بازرسی. مناسب ممیزی داخلی."
              : "Show image, measurements, and decision for each inspection id. Ready for audits."}
          </p>
        </Card>
        <Card
          title={isFa ? "اتصال به خطوط فنر لول" : "Connected to Fanar Lool lines"}
          subtitle="OPC UA / MQTT / Modbus"
          actions={<Badge tone="success">{isFa ? "قابل استقرار" : "Deployable"}</Badge>}
        >
          <p className="text-sm text-slate-600">
            {isFa
              ? "این نما نشان می‌دهد در استقرار واقعی، چگونه داده‌ها برخط جمع‌آوری، ذخیره و با نسخه مدل تطبیق می‌شوند."
              : "Demonstrates how real deployment will ingest, store, and align data with model versions."}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PlatformPage;
