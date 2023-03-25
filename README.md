# CredBase - Digitizing Asset Information / Repository for Any and Every Piece of Data


CredBase (Credible Database) - Where you can centralize and keep all your information in digital form!


### Glossary

Entity - company / organization / institution / etc.


## Overview

`CredBase` aims to centralize and safeguard any and every kind of data you want. The vision:
* remove the need for all "Hard Copy" (meaning physical, like a letter) information.
* credentials, assets, information, and more.
* share any information to any other user/entity.
* stop people from losing important information
* entities not needing to setup/maintain their own asset/content management and information.


CredBase has a few main concepts to achieve this mission and vision:
* **Authority** - This is an entity that defines **Assets** and issues **Items**, such as c.
* **Asset** - This is a definition/construct/blueprint/etc for some piece of information.
* **Item** - This is a body of information that is in instance of an **Asset**.
* **User** - People who use the platform
* **Client** - This is the link bewteen a `User` and an `Authority` (a User can have items from many different Authorities and an Authority can issue items to many different Users). An `Authority` creates a `Client` profile for a User and adds `Items` to their Client profile.



### Example

Lets take regular stores for example, like a supermarket. In this scenario, the supermarket would be the `Authority`. As a supermarket, each purchase requires a  receipt; a receipt would be an `Asset`. A customer could be a `Client` of the supermarket Authority. When that Client makes a purchase, the receipt could be added to their Client profile as an `Item` (instance) of that receipt Asset. Not only that, supermarket may also have rewards/member cards; this would be another type of Asset for the supermarket Authority. The customer Client could also have a membership Item with the supermarket Authority.

Another example is a Bank. A Bank Authority could have a Bank Statement Asset and issue Items of that type to their Clients.

In the context of government, the department of homeland security could be an Authority with a Birth Certificate Asset and issue Birth Certificate Items to Clients.



Another important purpose of this vision is to make verification processes effortless. For example, when onboarding to a new job, ID and social security number and other pieces of information are typically asked for. Instead of having to bring hard copies, the user could send regulated access to those items from their credbase account; the requesting entity can validate the Item's credibility by checking that it is an Asset of a verified/credible Authority.



### Items

An `Item` can have any arbitrary piece of information through fields (a name and a value, like time=1:58 PM, cost=24.38); a field can also have sub fields. In the supermarket example, here is what an Item object would something look like:

```json
{
  "id": 15,
  "uuid": "<uuid>",
  "metadata": "{}", // JSON string
  "created_at": "<timestamp>",
  "updated_at": "<timestamp>",
  "deleted_at": "<timestamp>",

  "client": {
    "id": 2,
    "uuid": "<uuid>",
    "metadata": "{}",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>",
    "deleted_at": "<timestamp>",

    "user": {
      "id": 3,
      "uuid": "<uuid>",
      "metadata": "{}",
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": "<timestamp>",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@doe.com",
      "person_verified": true
    },

    "authority": {
      "id": 4,
      "uuid": "<uuid>",
      "metadata": "{}",
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": "<timestamp>",
      "name": "Super Market",
      "description": "Local Super Fresh Goods",
      "industry": "Food & Wholesale",
      "support_email": "support@supermarket.com",
      "business_website": "supermarket.com",
      "support_website": "supermarket.com/support",
      "account_verified": true,
    },
  },

  "asset": {
    "id": 1,
    "uuid": "<uuid>",
    "metadata": "{}",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>",
    "deleted_at": "<timestamp>",
    "authority_id": 4,
    "name": "Receipt",
    "description": "Super Market Receipts",
    "multiple": true,
    "active": true,
  },

  "fields": [
    {
      "id": 50,
      "uuid": "<uuid>",
      "metadata": "{}",
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": "<timestamp>",

      "item_id": 15,
      "parent_field_id": null,
      "has_children": false,
      "name": "Time of Purchase",
      "value": "<timestamp>",
      "type": "datetime",
      "key": "PURCHASE_TIME",
      "fields": []
    },
    {
      "id": 51,
      "uuid": "<uuid>",
      "metadata": "{}",
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": "<timestamp>",

      "item_id": 15,
      "parent_field_id": null,
      "has_children": true,
      "name": "Payment Method",
      "value": "VISA Debit",
      "type": "datetime",
      "key": "PAYMENT_METHOD",
      "fields": [
        {
          "id": 52,
          "uuid": "<uuid>",
          "metadata": "{}",
          "created_at": "<timestamp>",
          "updated_at": "<timestamp>",
          "deleted_at": "<timestamp>",

          "item_id": 15,
          "parent_field_id": 51,
          "has_children": true,
          "name": "Debit Last 4",
          "value": "1234",
          "type": "number",
          "key": "DEBIT_LAST_4",
        }
      ]
    },
    {
      "id": 53,
      "uuid": "<uuid>",
      "metadata": "{}",
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": "<timestamp>",

      "item_id": 15,
      "parent_field_id": null,
      "has_children": true,
      "name": "Grocery Items",
      "value": "1",
      "type": "number",
      "key": "GROCERY_LIST",
      "fields": [
        {
          "id": 52,
          "uuid": "<uuid>",
          "metadata": "{}",
          "created_at": "<timestamp>",
          "updated_at": "<timestamp>",
          "deleted_at": "<timestamp>",

          "item_id": 15,
          "parent_field_id": 53,
          "has_children": true,
          "name": "Chocolate Bar",
          "value": "1.49",
          "type": "currency",
          "key": "GROCERY_ITEM",
        }
      ]
    }
  ]
}
```



## Closing Point


All of your informational needs, in one, safe place.