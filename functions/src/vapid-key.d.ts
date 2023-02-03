import { StringParam } from "firebase-functions/lib/params/types"

export interface Key {
    pub: string
    secret: StringParam
}
