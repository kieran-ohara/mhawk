import useSWR from "swr";

export default function useTags() {
  const { data, error } = useSWR("/api/v0/tags", async (req) => {
    const response = await fetch(req);
    return response.json();
  });

  return {
    tags: data,
    isLoading: !error && !data,
    isError: error,
  };
}
