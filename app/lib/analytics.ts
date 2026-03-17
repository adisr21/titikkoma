type MetricName = "group_share_clicked" | "group_share_opened";

type StoredMetric = {
  count: number;
  lastTriggeredAt: string;
  lastPayload?: Record<string, unknown>;
};

type MetricsStore = Partial<Record<MetricName, StoredMetric>>;

const STORAGE_KEY = "tt_growth_metrics";

export function trackEvent(
  name: MetricName,
  payload?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  const existing = readMetrics();
  const current = existing[name];

  const next: MetricsStore = {
    ...existing,
    [name]: {
      count: (current?.count ?? 0) + 1,
      lastTriggeredAt: new Date().toISOString(),
      lastPayload: payload,
    },
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(
    new CustomEvent("tt:analytics", { detail: { name, payload } })
  );
}

function readMetrics(): MetricsStore {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MetricsStore) : {};
  } catch {
    return {};
  }
}
