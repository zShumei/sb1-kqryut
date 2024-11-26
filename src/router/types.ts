export interface RouteMeta {
  title: string;
  icon?: string;
  orderNo?: number;
}

export interface AppRouteModule {
  path: string;
  name: string;
  component: any;
  redirect?: string;
  meta: RouteMeta;
  children?: AppRouteModule[];
}