Write-Host "Instalando dependencias para el detector de manos..." -ForegroundColor Green
pip install opencv-python mediapipe
if ($LASTEXITCODE -eq 0) {
    Write-Host "Instalacion completada exitosamente!" -ForegroundColor Green
} else {
    Write-Host "Error en la instalacion. Verifica que Python y pip esten instalados correctamente." -ForegroundColor Red
}
