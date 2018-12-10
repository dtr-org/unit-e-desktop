import { ViewChild, Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTable, MatTableDataSource, MatCheckboxChange } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Observer, Subject, BehaviorSubject } from 'rxjs';

import { RpcService } from 'app/core/rpc/rpc.service';
import { UnspentOutput } from 'app/core/rpc/rpc-types';


@Component({
  selector: 'app-coin-selection',
  templateUrl: './coin-selection.component.html',
  styleUrls: ['./coin-selection.component.scss'],
})
export class CoinSelectionComponent implements AfterViewInit {

  @ViewChild('table') table: MatTable<any>;

  @Output() selectCoins: EventEmitter<UnspentOutput[]>;

  selectedCoins: Set<UnspentOutput>;

  transactions: TransactionSource;

  displayedColumns: string[] = ['select', 'txid', 'amount'];

  private observer: UnspentOutput[];

  constructor(
    private rpc: RpcService,
    private router: Router,
  ) {
    this.transactions = new TransactionSource();
    this.selectCoins = new EventEmitter<UnspentOutput[]>();
  }

  ngAfterViewInit(): void {
    this.rpc.listUnspent().subscribe((utxos) => {
      this.selectedCoins = new Set<UnspentOutput>();
      this.transactions.update(utxos);
    });
  }

  selectOutput($event: MatCheckboxChange, utxo: UnspentOutput) {
    if ($event.checked) {
      this.selectedCoins.add(utxo);
    } else {
      this.selectedCoins.delete(utxo);
    }

    this.selectCoins.emit(Array.from(this.selectedCoins));
  }

  searchAddress(address: string) {
    this.router.navigateByUrl(`/wallet/history/${address}`);
  }
}

class TransactionSource extends MatTableDataSource<UnspentOutput> {

  private dataStream: BehaviorSubject<any>;

  constructor() {
    super();
    this.dataStream = new BehaviorSubject([]);
  }

  update(data: UnspentOutput[]) {
    this.dataStream.next(data);
  }

  connect(): BehaviorSubject<UnspentOutput[]> {
    return this.dataStream;
  }

  disconnect() {
    this.dataStream.unsubscribe();
  }
}
