import React from 'react';
import { useRouter } from 'next/router';

import AppFrame from '../components/app-frame';
import PaymentPlanGrid from '../containers/payment-plan-grid';

const columns = [];

export default function SearchResults() {
  const router = useRouter();
  const { q: search } = router.query;
  return (
    <>
      <AppFrame title="Search Results">
        <PaymentPlanGrid
          apiQueryParams={{ search }}
          columns={columns}
          showEditButtons="true"
        />
      </AppFrame>
    </>
  );
}
