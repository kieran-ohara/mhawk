import useSWR from "swr";

const useOutgoing = (id: number) => {
  const getOutgoingUrl = `/api/v0/payment-plan/${id}`;
  const { data, error, mutate } = useSWR(getOutgoingUrl, async (url) => {
    if (id !== null) {
      const response = await fetch(url);
      return response.json();
    }
  });

  const addTag = (tagId: number) => {
    return fetch(`/api/v0/payment-plan/${id}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tag_id: tagId,
      }),
    });
  };

  const removeTag = (tagId: number) => {
    return fetch(`/api/v0/payment-plan/${id}/tag/${tagId}`, {
      method: "DELETE",
    });
  };

  const update = (data) => {
    return fetch(`/api/v0/payment-plan/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  return {
    update,
    outgoing: data,
    isLoading: !error && !data,
    isError: error,
    addTag,
    removeTag,
  };
};

export { useOutgoing };
