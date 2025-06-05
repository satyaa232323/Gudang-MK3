<div class="section">
    <h3 class="section-title">Daftar Produk</h3>
    <table>
        <thead>
            <tr>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Harga</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($products as $product)
                <tr>
                    <td>{{ $product->nama_barang }}</td>
                    <td>{{ $product->category ? $product->category->nama_kategori : '-' }}</td>
                    <td>{{ $product->stok }}</td>
                    <td>Rp {{ number_format($product->harga, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
<div class="section">
    <h3 class="section-title">Transaksi (30 Hari Terakhir)</h3>
    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Nama Barang</th>
                <th>Jenis Transaksi</th>
                <th>Jumlah</th>
                <th>Total Harga</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transactions->sortByDesc('tanggal')->take(20) as $transaction)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($transaction->tanggal)->format('d/m/Y') }}</td>
                    <td>{{ $transaction->product ? $transaction->product->nama_barang : '-' }}</td>
                    <td>{{ ucfirst($transaction->jenis_transaksi) }}</td>
                    <td>{{ $transaction->jumlah }}</td>
                    <td>Rp
                        {{ number_format($transaction->jumlah * ($transaction->product ? $transaction->product->harga : 0), 0, ',', '.') }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
