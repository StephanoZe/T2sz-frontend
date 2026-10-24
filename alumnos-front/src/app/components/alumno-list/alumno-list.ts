import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Alumno } from '../../models/alumno';
import { AlumnoService } from '../../services/alumno';

@Component({
  selector: 'app-alumno-list',
  imports: [DecimalPipe],
  templateUrl: './alumno-list.html',
  styleUrl: './alumno-list.scss'
})
export class AlumnoList implements OnInit {

  private alumnoService = inject(AlumnoService);

  alumnos = signal<Alumno[]>([]);
  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.alumnoService.listar().subscribe({
      next: (data) => {
        this.alumnos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.');
        this.cargando.set(false);
      }
    });
  }

  eliminar(alumno: Alumno): void {
    if (!confirm(`¿Seguro que desea eliminar a ${alumno.nombres}?`)) {
      return;
    }

    this.alumnoService.eliminar(alumno.id).subscribe({
      next: () => {
        this.alumnos.update(lista => lista.filter(a => a.id !== alumno.id));
      },
      error: () => {
        this.error.set(`No se pudo eliminar al alumno ${alumno.nombres}.`);
      }
    });
  }
}