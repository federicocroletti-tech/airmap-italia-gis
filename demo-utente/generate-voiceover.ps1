$ErrorActionPreference = 'Stop'
$outputPath = Join-Path $PSScriptRoot 'airmap-voiceover-it.wav'

Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
    $voice = $synth.GetInstalledVoices() |
        Where-Object { $_.Enabled -and $_.VoiceInfo.Culture.Name -eq 'it-IT' } |
        Select-Object -First 1
    if (-not $voice) {
        throw 'Non è installata una voce italiana it-IT. Installa una voce italiana di Windows prima di generare il voice-over.'
    }
    $synth.SelectVoice($voice.VoiceInfo.Name)
    $synth.Rate = 2
    $synth.Volume = 100
    $synth.SetOutputToWaveFile($outputPath)
    $synth.Speak("AirMap Italia: partiamo dalla mappa di Milano. Cerchiamo il quartiere Centrale e selezioniamolo tra i risultati. Nel dettaglio leggiamo l'indice AQI e gli indicatori, come PM dieci, PM due e mezzo e biossido di azoto. Il grafico mostra lo storico dimostrativo. Con Analizza area passiamo ai ranking e confrontiamo le zone. Sono dati di esempio, non aggiornati in tempo reale. AirMap: esplorare i dati, capire il territorio.")
}
finally {
    $synth.Dispose()
}

Write-Output "Voice-over italiano generato con $($voice.VoiceInfo.Name): $outputPath"
