const axios = require('axios');
exports.main = async (context) => {
  const dealId = "329290029801";
  const token = process.env.PRIVATE_APP_ACCESS_TOKEN;
  const action = context.parameters?.action;

  console.log("Action:", action);
  console.log("ContactId:", context.parameters?.contactId);

  if (action === "associate") {
    const contactId = context.parameters.contactId;
    try {
      await axios.put(
        `https://api.hubapi.com/crm/v4/objects/contacts/${contactId}/associations/default/deals/${dealId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { statusCode: 200, body: { success: true, message: "Associated" } };
    } catch (e) {
      console.log("Associate error:", e.message, e.response?.data);
      return { statusCode: e.response?.status || 500, body: { success: false, error: e.message } };
    }
  }

  // fetch action
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=dealname,amount,dealstage`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (e) {
    return { error: e.message };
  }
};