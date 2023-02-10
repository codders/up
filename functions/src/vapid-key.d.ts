import { StringParam } from 'firebase-functions/lib/params/types';

export interface Key {
  pub: StringParam;
  secret: StringParam;
}
