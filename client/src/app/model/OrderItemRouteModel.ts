// Order Interface
export interface Order {
  address: string;
  arrived_at: string;
  client_name: string;
  dispatched_at: Date; // Creation Value
  created_at: Date; // Scan Value
  customer: string;
  delivered_at: Date;
  updated_at: Date;
  order_info: any[]; // Consider defining a more specific type if possible
  order_number: string;
  phone_number: string;
  pickers: boolean;
  dispatch: boolean;
  is_delivered: boolean;
  driver_name: string;
  avg_dispatch_time: string;
  avg_picking_time: string;
  latitude: number;
  longitude: number;
  route: any; // Define a specific type if necessary
  order_index: number;
  route_started: boolean;
  geo: RouteGeo;
  received_by: string;
  ship_addr1: string;
  ship_addr2: string;
  ship_addr3: string;
  price: string;
  cancel_at: Date;
  active: boolean;
  merged_order_numbers: string[];
}

// RouteGeo Interface
export interface RouteGeo {
  arrival: string;
  departure: string;
  length: number;
  duration: number;
}

// OrdersResponse Interface
export interface OrdersResponse {
  orders: Order[];
  tentative_orders: Order[];
  cancel_orders: Order[];
  orders_count: number;
  tentative_orders_count: number;
  cancel_orders_count: number;
  orders_filtered_count: number;
  tentative_orders_filtered_count: number;
  cancel_orders_filtered_count: number;
}

// OrderRouting Interface
export interface OrderRouting {
  id: string;
  storeCoords: string;
  destinationCoords: string;
  routeTime?: number;
}

// Item Interface
export interface Item {
  id: number;
  store: string;
  order_number: string;
  item: string;
  description: string;
  units: number;
  state: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
  loc: string;
  is_reserved: boolean;
  is_archived: boolean;
  is_missing: boolean;
  upc: string;
  picked_by: string;
  reserved_by: string;
}
