# HubSpot Serverless Function – Deal Association Card

## Overview

This HubSpot Serverless Function powers a custom UI Extension Card that displays deal information and allows users to associate a contact with a predefined deal directly from the HubSpot CRM interface.

The function supports two operations:

1. **Fetch Deal Information** – Retrieves deal details such as name, amount, and stage.
2. **Associate Contact to Deal** – Creates an association between a contact and a specific deal.

---

## Functionality

### Fetch Deal Details

When no action parameter is provided, the function retrieves the following properties from the configured deal:

* Deal Name (`dealname`)
* Amount (`amount`)
* Deal Stage (`dealstage`)

### Associate Contact

When the `action` parameter is set to `associate`, the function:

1. Reads the provided `contactId`
2. Associates the contact with the configured deal
3. Returns a success response if the association is created

---

## Configuration

### Environment Variables

The function requires a HubSpot Private App Access Token.

| Variable                   | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `PRIVATE_APP_ACCESS_TOKEN` | HubSpot Private App token used for API authentication |

Example:

```bash
PRIVATE_APP_ACCESS_TOKEN=your_private_app_token
```

---

## Hardcoded Deal

The current implementation uses a fixed deal ID:

```javascript
const dealId = "329290029801";
```

This deal will be:

* Displayed when fetching deal information
* Used for all contact associations

---

## API Endpoints Used

### Get Deal Details

```http
GET /crm/v3/objects/deals/{dealId}
```

Properties requested:

```text
dealname
amount
dealstage
```

### Associate Contact with Deal

```http
PUT /crm/v4/objects/contacts/{contactId}/associations/default/deals/{dealId}
```

---

## Request Parameters

### Fetch Deal

No parameters required.

Example:

```json
{}
```

### Associate Contact

```json
{
  "action": "associate",
  "contactId": "123456"
}
```

---

## Success Responses

### Deal Fetch Response

```json
{
  "id": "329290029801",
  "properties": {
    "dealname": "Sample Deal",
    "amount": "1000",
    "dealstage": "closedwon"
  }
}
```

### Association Response

```json
{
  "success": true,
  "message": "Associated"
}
```

---

## Error Handling

The function captures HubSpot API errors and returns:

```json
{
  "success": false,
  "error": "Error message"
}
```

The serverless logs also record:

* Requested action
* Contact ID
* HubSpot API error details
* HTTP status codes

---

## Usage Flow

1. User opens the HubSpot UI Extension Card.
2. The card calls the serverless function.
3. Deal information is displayed.
4. User selects a contact and clicks Associate.
5. The card sends:

```json
{
  "action": "associate",
  "contactId": "<contact-id>"
}
```

6. The serverless function creates the deal-contact association.
7. A success message is returned to the UI.

---

## Technologies Used

* HubSpot UI Extensions
* HubSpot Serverless Functions
* HubSpot CRM API v3
* HubSpot CRM Associations API v4
* Node.js
* Axios
