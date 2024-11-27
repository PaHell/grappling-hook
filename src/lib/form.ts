export enum FormType {
      Create,
      Update
}

export type FormDialog<T> = {
      type: FormType;
      title: string;
      data: T;
};