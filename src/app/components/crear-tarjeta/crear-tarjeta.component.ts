import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css'],
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, 
    private _tarjetaService: TarjetaService,
    private toastr: ToastrService
    ) {

    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      expiracion: ['', Validators.required],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
  }

  ngOnInit(): void {}

  crearTarjeta() {
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.expiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }
    
    this.loading = true;

    this._tarjetaService.guardarTarjeta(TARJETA).then(()=>{
      console.log('tarjeta registrada');
      this.loading = false;
      this.toastr.success('La tarjeta ha sido agregada con éxito', 'Tarjeta registrada');
    }, error => {
      this.loading = false;
      this.toastr.error('Opps... ocurrió un error', 'Error al registrar tarjeta');
      console.log(error);
    });
  }
}
