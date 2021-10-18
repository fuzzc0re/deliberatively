import { serialize } from "borsh";

// pub const MAX_VOTE_PARTICIPANT_LEN: usize = 1 + // enum [key]
//     32 + // Pubkey [vote market token mint account address]
//     32 + // Pubkey [mint associated address of participant]
//     1 + // bool [has provided keyword]
//     1 + // bool [is representative]
//     32; // Pubkey [address of alternative proposed]
//
// #[repr(C)]
// #[derive(BorshSerialize, BorshDeserialize, Debug)]
// pub struct VoteParticipant {
//     /// For deserialization in order to recognize the type of state to modify.
//     pub key: Key,
//     /// The vote market token mint that this participant is associated with.
//     pub vote_market_pubkey: Pubkey,
//     /// The participant's token holding address.
//     pub vote_market_participant_pubkey: Pubkey,
//     // /// Is this an account created through the "participate" instruction or not?
//     // pub has_provided_keyword: bool,
//     /// Is this account a representative?
//     /// If yes then this account has the top [maximum_number_of_representatives] tokens.
//     pub is_representative: bool,
//     /// If the account is a representative then they might have proposed an alternative
//     /// for the participants to vote on.
//     pub alternative: Option<Pubkey>,
// }
//
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
