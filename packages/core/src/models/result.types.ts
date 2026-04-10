export type Result<TResult, TErrorMessage extends string> =
	| { success: true; val: TResult }
	| { success: false; err: TErrorMessage };
