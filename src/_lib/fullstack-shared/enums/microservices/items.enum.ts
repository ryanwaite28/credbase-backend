export enum ItemsQueueMessageTypes {
  FETCH_ITEM_WITH_FIELDS_BY_ID = "FETCH_ITEM_WITH_FIELDS_BY_ID",
  FETCH_ITEM_BY_ID = "FETCH_ITEM_BY_ID",
  FETCH_ITEM_BY_UUID = "FETCH_ITEM_BY_UUID",

  FETCH_ITEM_FIELD_BY_ID = "FETCH_ITEM_FIELD_BY_ID",
  FETCH_ITEM_FIELD_BY_UUID = "FETCH_ITEM_FIELD_BY_UUID",

  FETCH_ITEMS_BY_CLIENT_ID = "FETCH_ITEMS_BY_CLIENT_ID",
  FETCH_ITEMS_BY_CLIENT_ID_PAGINATE = "FETCH_ITEMS_BY_CLIENT_ID_PAGINATE",

  FETCH_ITEMS_BY_ASSET_ID = "FETCH_ITEMS_BY_ASSET_ID",
  FETCH_ITEMS_BY_ASSET_ID_PAGINATE = "FETCH_ITEMS_BY_ASSET_ID_PAGINATE",

  FETCH_ITEM_FIELDS_BY_ITEM_ID = "FETCH_ITEM_FIELDS_BY_ITEM_ID",
  FETCH_ITEM_FIELDS_BY_ITEM_ID_PAGIATE = "FETCH_ITEM_FIELDS_BY_ITEM_ID_PAGIATE",

  FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID = "FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID",
  FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE = "FETCH_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE",

  CREATE_ITEM = "CREATE_ITEM",
}




export enum ItemsQueueEventTypes {
  FETCHED_ITEM_WITH_FIELDS_BY_ID = "FETCHED_ITEM_WITH_FIELDS_BY_ID",
  FETCHED_ITEM_BY_ID = "FETCHED_ITEM_BY_ID",
  FETCHED_ITEM_BY_UUID = "FETCHED_ITEM_BY_UUID",

  FETCHED_ITEM_FIELD_BY_ID = "FETCHED_ITEM_FIELD_BY_ID",
  FETCHED_ITEM_FIELD_BY_UUID = "FETCHED_ITEM_FIELD_BY_UUID",

  FETCHED_ITEMS_BY_CLIENT_ID = "FETCHED_ITEMS_BY_CLIENT_ID",
  FETCHED_ITEMS_BY_CLIENT_ID_PAGINATE = "FETCHED_ITEMS_BY_CLIENT_ID_PAGINATE",

  FETCHED_ITEMS_BY_ASSET_ID = "FETCHED_ITEMS_BY_ASSET_ID",
  FETCHED_ITEMS_BY_ASSET_ID_PAGINATE = "FETCHED_ITEMS_BY_ASSET_ID_PAGINATE",

  FETCHED_ITEM_FIELDS_BY_ITEM_ID = "FETCHED_ITEM_FIELDS_BY_ITEM_ID",
  FETCHED_ITEM_FIELDS_BY_ITEM_ID_PAGIATE = "FETCHED_ITEM_FIELDS_BY_ITEM_ID_PAGIATE",

  FETCHED_ITEM_FIELDS_BY_PARENT_FIELD_ID = "FETCHED_ITEM_FIELDS_BY_PARENT_FIELD_ID",
  FETCHED_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE = "FETCHED_ITEM_FIELDS_BY_PARENT_FIELD_ID_PAGINATE",

  ITEM_CREATED = "ITEM_CREATED",
}
