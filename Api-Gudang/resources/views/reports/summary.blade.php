<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Laporan Gudang</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .report-date {
            font-size: 14px;
            color: #666;
        }

        .section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="company-name">Laporan Gudang</div>
        <div class="report-date">Tanggal: {{ $date }}</div>
    </div>

    <div class="section">
        <div class="section-title">Daftar Produk</div>
        <table>
            <thead>
                <tr>
                    <th>Nama Produk</th>
                    <th>Kategori</th>
                    <th>Stok</th>
                    <th>Harga</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($products as $product)
                    <tr>
                        <td>{{ $product->nama_barang }}</td>
                        <td>{{ $product->category ? $product->category->nama_kategori : 'Tanpa Kategori' }}</td>
                        <td>{{ number_format($product->stok, 0, ',', '.') }}</td>
                        <td>Rp {{ number_format($product->harga, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Transaksi (30 Hari Terakhir)</div>
        <table>
            <thead>
                <tr>
                    <th>Tanggal</th>
                    <th>Nama Barang</th>
                    <th>Jenis</th>
                    <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($transactions as $transaction)
                    <tr>
                        <td>{{ Carbon\Carbon::parse($transaction->tanggal)->format('d/m/Y') }}</td>
                        <td>{{ $transaction->product ? $transaction->product->nama_barang : '-' }}</td>
                        <td>{{ ucfirst($transaction->jenis_transaksi) }}</td>
                        <td>{{ number_format($transaction->jumlah, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        Laporan ini dibuat secara otomatis pada {{ $date }}
    </div>
</body>

</html>
