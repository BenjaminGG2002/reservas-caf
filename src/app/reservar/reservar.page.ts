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
    const reservasEnFecha = this.reservas.get(this.selectedDate) || new Map<string, string[]>();

    const todasReservas = Array.from(reservasEnFecha.values()).reduce((acc, val) => acc.concat(val), []);
    const reservasParaSeccion = todasReservas.filter(s => s === this.seccionSeleccionada?.hora).length;

    if (reservasParaSeccion < 20) {
      const reservasUsuario = reservasEnFecha.get(this.rutUsuario) || [];
      reservasUsuario.push(this.seccionSeleccionada.hora);
      reservasEnFecha.set(this.rutUsuario, reservasUsuario);
      this.reservas.set(this.selectedDate, reservasEnFecha);

      this.mensajeReserva = `Reserva confirmada para el ${this.selectedDate} a las ${this.seccionSeleccionada.hora}. RUT: ${this.rutUsuario}`;
      this.rutUsuario = ''; // Limpiar el campo de RUT
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
    if (this.seccionSeleccionada) {
      const reservasEnFecha = this.reservas.get(this.selectedDate);
  
      if (reservasEnFecha) {
        reservasEnFecha.forEach((reservasUsuario, rut) => {
          const index = reservasUsuario.indexOf(this.seccionSeleccionada!.hora);
          if (index > -1) {
            reservasUsuario.splice(index, 1); // Eliminar la reserva
            reservasEnFecha.set(rut, reservasUsuario);
          }
        });
  
        this.reservas.set(this.selectedDate, reservasEnFecha);
        this.mensajeReserva = ''; // Limpiar el mensaje de reserva
        this.cargarSecciones();
        this.seccionSeleccionada = null; // Limpiar la selección de sección
      } else {
        alert('No se encontraron reservas para eliminar.');
      }
    } else {
      alert('No hay ninguna sección seleccionada para eliminar.');
    }
  }
  

  modificarReserva() {
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
  }
}
