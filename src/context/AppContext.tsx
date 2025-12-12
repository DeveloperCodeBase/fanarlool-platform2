import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import {
  generateMockData,
  MockData,
  FilteredData,
  Selection,
  filterMockData
} from "../data/mockGenerator";

type AppContextValue = {
  language: "fa" | "en";
  isRTL: boolean;
  selection: Selection;
  setSelection: (s: Partial<Selection>) => void;
  data: MockData;
  filtered: FilteredData;
  factories: MockData["factories"];
  products: string[];
  changeLanguage: (lng: "fa" | "en") => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<"fa" | "en">(
    (localStorage.getItem("lang") as "fa" | "en") || "fa"
  );
  const [selection, setSelectionState] = useState<Selection>({
    factoryId: "fanarlool",
    range: "7d",
    shift: "A",
    product: "A"
  });

  const data = useMemo(() => generateMockData(), []);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("lang", language);
  }, [language, i18n]);

  const setSelection = (next: Partial<Selection>) => {
    setSelectionState((prev) => ({ ...prev, ...next }));
  };

  const filtered = useMemo(
    () => filterMockData(data, selection),
    [data, selection]
  );

  const value: AppContextValue = {
    language,
    isRTL: language === "fa",
    selection,
    setSelection,
    data,
    filtered,
    factories: data.factories,
    products: data.products,
    changeLanguage: setLanguage
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return ctx;
};
