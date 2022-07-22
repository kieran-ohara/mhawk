import useSWR from 'swr';

// eslint-disable-next-line
const useSubscriptions = () => {
  const getSubscriptionsUrl = '/api/v0/payment-plans?has_end_date=false';
  const { data, error, mutate } = useSWR(getSubscriptionsUrl, async (url) => {
    const response = await fetch(url)
    return response.json();
  });

  const create = async (okData) => {
    const {
      reference,
      monthlyPrice,
      startDate,
    } = okData;
    return fetch('/api/v0/payment-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        reference,
        monthly_price: monthlyPrice,
        start_date: startDate,
      }]),
    });
  };

  const deleteSubscription = async(id) => {
    await fetch(
      `/api/v0/payment-plan/${id}`,
      { method: 'DELETE' },
    );
    mutate();
  }

  return {
    create,
    deleteSubscription,
    subscriptions: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

const useSubscription = (id) => {
  const getSubscriptionsUrl = `/api/v0/payment-plan/${id}`;
  const { data, error, mutate } = useSWR(getSubscriptionsUrl, async (url) => {
    if (id !== null) {
      const response = await fetch(url);
      return response.json();
    }
  })

  const addTag = async (tagId) => {
    try {
      await fetch(
        `/api/v0/payment-plan/${id}/tags`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tag_id: tagId,
          }),
        },
      );
    } finally {
      mutate();
    }
  }

  const removeTag = async (tagId) => {
    try {
    await fetch(
      `/api/v0/payment-plan/${id}/tag/${tagId}`,
      { method: 'DELETE' },
    );
    } finally {
      mutate();
    }
  }

  return {
    subscription: data,
    isLoading: !error && !data,
    isError: error,
    addTag,
    removeTag,
  }
}

export { useSubscriptions, useSubscription };
