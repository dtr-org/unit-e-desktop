import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';

import { SnackbarService } from 'app/core/snackbar/snackbar.service';
import { TransactionBuilder, FeeDetermination } from 'app/wallet/wallet/send/transaction-builder.model';
import { SendService } from 'app/wallet/wallet/send/send.service';
import { Amount } from 'app/core/util/utils';


@Component({
  selector: 'app-fee-options',
  templateUrl: './fee-options.component.html',
  styleUrls: ['./fee-options.component.scss']
})
export class FeeOptionsComponent implements OnInit {

  @Input() send: TransactionBuilder;

  @Output() updateFee: EventEmitter<Amount> = new EventEmitter<Amount>();

  customFee: string;

  CONFIRMATION_TARGETS: number[] = [2, 4, 6, 12, 24, 48, 144, 504, 1008];

  constructor(
    private sendService: SendService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit() {
    if (!this.send) {
      this.send = new TransactionBuilder();
    }
  }

  updateSelectedFee(): void {
    this.sendService.getTransactionFee(this.send)
      .subscribe(x => {
        this.send.selectedFee = x.fee;
        this.updateFee.emit(this.send.selectedFee);
      },
      e => {
        this.snackbar.open(e.message);
      });
  }

  changeCustomFee() {
    this.send.customFee = Amount.fromString(this.customFee);
  }

}
