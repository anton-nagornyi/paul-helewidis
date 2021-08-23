export enum BulkVerb {
  Post = 'POST',
  Get = 'GET',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Put = 'PUT',
}

export type ActionPayload = {
  variables?: { [key: string]: any };
};

export type Action = {
  url: string;
  verb: BulkVerb;
  body?: { [key: string]: any };
  payload?: ReadonlyArray<ActionPayload>
};
