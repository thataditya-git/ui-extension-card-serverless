import React, { useState } from "react";
import { Card, Button, Text, hubspot } from "@hubspot/ui-extensions";

hubspot.extend(({ runServerlessFunction, context }) => (
  <Extension runServerless={runServerlessFunction} context={context} />
));

const Extension = ({ runServerless, context }: { runServerless: any; context: any }) => {  const [deal, setDeal] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [associateMessage, setAssociateMessage] = useState(null);

  const fetchDeal = async () => {
    setLoading(true);
    const resp = await runServerless({
      name: "cardd2_app_function",
      parameters: { action: "fetch" }
    });
    if (resp.response?.body?.error) {
      setError(resp.response.body.error);
    } else {
      setDeal(resp.response.properties);
      setError(null);
    }
    setLoading(false);
  };

  const associateDeal = async () => {
    setLoading(true);
    const resp = await runServerless({
      name: "cardd2_app_function",
      parameters: { action: "associate",
        contactId: context.crm.objectId
       } 
    });
    if (resp.response?.body?.success) {
      setAssociateMessage(resp.response.body.message);
      setError(null);
    } else {
      setError(resp.response?.body?.error || "Failed to associate");
    }
    setLoading(false);
  };

  return (
    <Card>
      <Button onClick={fetchDeal} disabled={loading}>
        {loading ? "Loading..." : "Get Linked Deal"}
      </Button>
      {error && <Text>Error: {error}</Text>}
      {deal && (
        <>
          <Text format={{ fontWeight: "bold" }}>Deal: {deal.dealname}</Text>
          <Text>Amount: {deal.amount}</Text>
          <Text>Stage: {deal.dealstage}</Text>
        </>
      )}

      <Button onClick={associateDeal} disabled={loading}>
        {loading ? "Associating..." : "Associate with Deal"}
      </Button>
      {associateMessage && <Text>{associateMessage}</Text>}
    </Card>
  );
};

export default Extension;