import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref, watch, type Ref } from 'vue';
import { useAuthStore } from './auth';
import { convertToSQLDate, toKievTimeZone } from '@/helpers/date.helper';

const apiUrl = import.meta.env.VITE_API_URL;

export const useReportStore = defineStore('report', () => {
  const auth = useAuthStore();

  const dateRange = ref([new Date(), new Date()]);

  const report: Ref<Report[]> = ref([]);

  const reports = ref([]);

  const loadReport = async () => {
    const response = await fetch(
      `${apiUrl}/reports/start/${convertToSQLDate(toKievTimeZone(dateRange.value[0]))}/end/${convertToSQLDate(toKievTimeZone(dateRange.value[1]))}`,
      {
        headers: {
          Authorization: `Bearer ${auth.getCookie('access_token')}`,
        },
      },
    );

    if (response.status === 200) {
      report.value = await response.json();
    }

    console.log(report.value);

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  const generateReport = async () => {
    const response = await fetch(
      `${apiUrl}/reports/start/${convertToSQLDate(toKievTimeZone(dateRange.value[0]))}/end/${convertToSQLDate(toKievTimeZone(dateRange.value[1]))}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${auth.getCookie('access_token')}`,
        },
      },
    );

    if (response.status === 200) {
      const filename = await response.text();
      await loadReports();
      window.location.replace(`${apiUrl}/reports/filename/${filename}`);
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  const loadReports = async () => {
    const response = await fetch(`${apiUrl}/reports`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) reports.value = await response.json();

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  const downloadReport = async (filename: string) => {
    window.location.replace(`${apiUrl}/reports/filename/${filename}`);
  }

  watch(dateRange, async () => {
    if (dateRange.value[0] && dateRange.value[1]) await loadReport();
  });

  const abstergents = computed(() => {
    const allAbstergents = report.value.flatMap((item) => item.abstergents);
    return [...new Set(allAbstergents.map((a) => a.name))].map((name) => ({
      name,
    }));
  });

  const reportData = computed(() => {
    return report.value.map((item) => {
      const row = {
        department: item.department,
        weight: Math.round(+item.weight),
        sum: Math.round(+item.sum),
      };

      abstergents.value.forEach((abstergent) => {
        const abstergentData = item.abstergents.find((a) => a.name === abstergent.name);
        row[abstergent.name] = abstergentData ? Math.round(+abstergentData.volume) : '0';
      });
      return row;
    });
  });

  const getAbstergentVolume = (row: object, name: string) => row[name] || '0';

  return {
    report,
    loadReport,
    dateRange,
    getAbstergentVolume,
    reportData,
    abstergents,
    generateReport,
    reports,
    loadReports,
    downloadReport
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReportStore, import.meta.hot));
}

interface Report {
  department: string;
  weight: string | number;
  perc?: string | number;
  abstergents: AbstergentData[];
  sum: string | number;
}

interface AbstergentData {
  name: string;
  volume: string | number;
}
