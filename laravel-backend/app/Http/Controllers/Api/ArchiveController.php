<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;

class ArchiveController extends Controller
{
    /**
     * Smallest valid PDF (placeholder). Replace storage/app/private/warehouse-documents.pdf with your real PDF.
     */
    private const PLACEHOLDER_PDF = "%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000104 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n165\n%%EOF\n";

    /**
     * Download the warehouse documents PDF.
     * Place your file at storage/app/private/warehouse-documents.pdf
     * If missing, a placeholder is created so the download button works; replace with your real PDF.
     */
    public function warehousePdf()
    {
        $dir = storage_path('app/private');
        $path = $dir . '/warehouse-documents.pdf';

        if (!File::exists($path)) {
            if (!File::isDirectory($dir)) {
                File::makeDirectory($dir, 0755, true);
            }
            File::put($path, self::PLACEHOLDER_PDF);
        }

        return response()->download($path, 'warehouse-documents.pdf', [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
