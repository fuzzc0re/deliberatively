import { serialize } from "borsh";

export class VoteAlternativeAccount {}

export const VoteAlternativeSchema = new Map([
  [
    VoteAlternativeAccount,
    {
      kind: "struct",
      fields: [["counter", "u32"]],
    },
  ],
]);

export const VOTE_ALTERNATIVE_SIZE = serialize(VoteAlternativeSchema, new VoteAlternativeAccount()).length;
