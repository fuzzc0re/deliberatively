import { serialize } from "borsh";

export class VoteParticipantAccount {
  counter = 0;
  constructor(fields: { counter: number } | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

export const VoteParticipantSchema = new Map([
  [
    VoteParticipantAccount,
    {
      kind: "struct",
      fields: [["counter", "u32"]],
    },
  ],
]);

export const VOTE_PARTICIPANT_SIZE = serialize(VoteParticipantSchema, new VoteParticipantAccount()).length;
