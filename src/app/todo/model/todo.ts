export class Todo {
  constructor(
    public id: number = 0,
    public name: string = '',
    public content: string = '',
    public status: TodoStatus = 'waiting'
  ) {}
}
export type TodoStatus = 'waiting' | 'in progress' | 'done';
