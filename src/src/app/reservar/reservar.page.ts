import { Component } from '@angular/core';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
})
export class ReservarPage {
  hoy: string = new Date().toISOString();
  selectedDate: string = this.hoy;
  secciones: { hora: string, disponible: boolean }[] = [];
  reservas: Map<string, Map<string, string[]>> = new Map(); // Modificación aquí
  mensaje: string = '';
  rutUsuario: string = '';
  seccionSeleccionada: { hora: string, disponible: boolean } | null = null;
  mensajeReserva: string = '';

  constructor() {
    this.secciones = [
      { hora: '08:30-10:00', disponible: true },
      { hora: '10:00-11:30', disponible: true },
      { hora: '11:30-13:00', disponible: true },
      { hora: '13:00-14:30', disponible: true },
      { hora: '14:30-16:00', disponible: true },
      { hora: '16:00-17:30', disponible: true }
    ];
  }

  cargarSecciones() {
    const fechaSeleccionada = new Date(this.selectedDate);
    const diaDeLaSemana = fechaSeleccionada.getDay();
    
    if (diaDeLaSemana === 0 || diaDeLaSemana === 6) {
      this.mensaje = 'Las reservas están disponibles solo de lunes a viernes.';
      this.secciones = []; // Limpiar secciones para días no válidos
      return;
    }

    this.mensaje = '';
    const reservasEnFecha = this.reservas.get(this.selectedDate) || new Map<string, string[]>();

    // Aplanar el array de reservas usando reduce() en lugar de flat()
    const todasReservas = Array.from(reservasEnFecha.values()).reduce((acc, val) => acc.concat(val), []);

    this.secciones.forEach(seccion => {
      seccion.disponible = todasReservas.filter(s => s === seccion.hora).length < 20;
    });
  }



  confirmarReserva() {
    if (!this.rutUsuario) {
      alert('Por favor, ingrese su RUT.');
      return;
    }
  
    if (this.seccionSeleccionada) {
      // Obtener las reservas de la fecha seleccionada, asegurándose de que sea un Map válido
      const reservasEnFecha = this.reservas.get(this.selectedDate) || new Map<string, string[]>();
  
      // Aplanar el array de reservas
      const todasReservas: string[] = Array.from(reservasEnFecha.values()).reduce((acc: string[], val: string[]) => acc.concat(val), []);
  
      // Verificar cuántas personas están reservando en la hora seleccionada
      const reservasParaSeccion = todasReservas.filter((s: string) => s === this.seccionSeleccionada?.hora).length;
  
      if (reservasParaSeccion < 20) {
        // Guardar la reserva
        const reservasUsuario: string[] = reservasEnFecha.get(this.rutUsuario) || [];
        reservasUsuario.push(this.seccionSeleccionada.hora);
        reservasEnFecha.set(this.rutUsuario, reservasUsuario);
  
        this.reservas.set(this.selectedDate, reservasEnFecha);
  
        this.mensajeReserva = `Reserva confirmada para el ${this.selectedDate} a las ${this.seccionSeleccionada.hora}. RUT: ${this.rutUsuario}`;
  
        // Limpiar selección de secciones pero mantener el RUT
        this.seccionSeleccionada = null;
        this.cargarSecciones();
      } else {
        alert('La sección seleccionada no tiene cupo disponible.');
      }
    } else {
      alert('Error: No se ha seleccionado ninguna sección.');
    }
  }
  
  eliminarReserva() {
    // Obtener las reservas para la fecha seleccionada
    const reservasEnFecha = this.reservas.get(this.selectedDate);
  
    if (reservasEnFecha && reservasEnFecha.has(this.rutUsuario)) {
      // Eliminar la reserva para el RUT especificado
      reservasEnFecha.delete(this.rutUsuario);
      this.reservas.set(this.selectedDate, reservasEnFecha);
  
      // Mostrar mensaje de confirmación
      this.mensajeReserva = `Reserva eliminada para el ${this.selectedDate}.`;
  
      // Limpiar el campo del RUT
      this.rutUsuario = '';
  
      // Actualizar las secciones disponibles
      this.cargarSecciones();
    } else {
      alert('No se encontró ninguna reserva para este RUT.');
    }
  }

  modificarReserva() {
    if (!this.rutUsuario) {
      alert('Por favor, ingrese su RUT para modificar la reserva.');
      return;
    }
  
    const reservasEnFecha = this.reservas.get(this.selectedDate);
  
    if (reservasEnFecha && reservasEnFecha.has(this.rutUsuario)) {
      // Eliminar la reserva actual
      reservasEnFecha.delete(this.rutUsuario);
  
      // Actualizar las reservas
      this.reservas.set(this.selectedDate, reservasEnFecha);
  
      // Limpiar la selección y el RUT
      this.seccionSeleccionada = null;
      this.rutUsuario = '';
  
      // Confirmar la nueva reserva
      this.confirmarReserva();
    } else {
      alert('No se encontró ninguna reserva para este RUT.');
    }
  }
  /*modificarReserva() {
    if (!this.rutUsuario) {
      alert('Por favor, ingrese su RUT para modificar la reserva.');
      return;
    }

    const reservasEnFecha = this.reservas.get(this.selectedDate);

    if (reservasEnFecha && reservasEnFecha.has(this.rutUsuario)) {
      reservasEnFecha.delete(this.rutUsuario); // Eliminar la reserva anterior
      this.confirmarReserva(); // Confirmar la nueva reserva
    } else {
      alert('No se encontró ninguna reserva para este RUT.');
    }
  }*/
}
