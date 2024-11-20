import { Component, signal } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { TodoService } from '../service/todo.service';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [TodoService],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class TodoComponent {
  name = signal<string>('');
  content = signal<string>('');
  newTodoId = 1;

  constructor(public todoService: TodoService) {}

  addTodo(): void {
    if (this.name() && this.content()) {
      const newTodo = new Todo(this.newTodoId++, this.name(), this.content(), 'waiting');
      this.todoService.addTodo(newTodo);
      this.name.set('');
      this.content.set('');
    }
  }

  changeStatus(todo: Todo, status: TodoStatus): void {
    todo.status = status;
    this.todoService.updateTodoStatus(todo);
  }

  get waitingTodos(): Todo[] {
    return this.todoService.getTodos().filter(todo => todo.status === 'waiting');
  }

  get inProgressTodos(): Todo[] {
    return this.todoService.getTodos().filter(todo => todo.status === 'in progress');
  }

  get doneTodos(): Todo[] {
    return this.todoService.getTodos().filter(todo => todo.status === 'done');
  }

  removeTodo(todo: Todo) {
    this.todoService.deleteTodo(todo)
  }
}
