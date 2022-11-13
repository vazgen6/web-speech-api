import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public form!: FormGroup;
  private synth!: SpeechSynthesis;
  public voices: SpeechSynthesisVoice[] = [];
  private utter = new SpeechSynthesisUtterance();

  constructor(
    private fb: FormBuilder,
    private zone: NgZone,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSpeechSynthesis();
  }

  private loadSpeechSynthesis(): void {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices = (): void => {
    window.speechSynthesis.onvoiceschanged = () => {
      this.zone.run(() => {
        this.voices = this.synth.getVoices();
        console.log(this.voices);
        if (this.voices.length) {
          this.form.get('voice')?.setValue(this.voices[0]);
        }
      });
      window.speechSynthesis.onvoiceschanged = null;
    };
  }

  private initForm(): void {
    this.form = this.fb.group({
      text: ['', [Validators.required]],
      voice: [null, [Validators.required]],
      pitch: [1, [Validators.required]],
      rate: [1, [Validators.required]],
    });
  }

  public speak(): void {
    console.log(this.form.value)
    const { text, voice, pitch, rate } = this.form.value;
    this.utter.text = text;
    this.utter.pitch = pitch;
    this.utter.voice = voice;
    this.utter.rate = rate;
    this.synth.speak(this.utter);
  }

  // https://www.youtube.com/watch?v=1xJxWCQ4G9c
  public office(): void {
    this.form.get('text')?.patchValue(`Hi, Jim.
I am Harvey, a computer. Jim sucks.
Pam, you look very hot today.
Me so horny, me love you long tim.
Long time. Me lobe yoy long time.
You ruined a funny joke you. Get out of my offive.
Boobs`);
  }
}
