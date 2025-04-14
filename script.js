<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Website CDN</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />
  <style>
    body { background-color: white; }
    .container { max-width: 960px; }
    .card {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 20px;
      margin-top: 20px;
      border: none;
    }
    .form-group { margin-bottom: 15px; }
    .btn-primary {
      background-color: #956FD6;
      border-color: #956FD6;
      color: white;
    }
    .btn-primary:hover {
      background-color: #956FD6;
      color: black;
    }
  </style>
</head>
<body>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div class="card-body">

          <!-- Agent Selection Dropdown -->
          <div class="form-group">
            <label for="select_agent">Select Agent</label>
            <select class="form-control" id="select_agent">
              <option value="">New Agent</option>
            </select>
          </div>

          <h4>Update Website Calling</h4>
          <form id="recallUpdateForm" action="{{ url_for('recall_update') }}" method="post" class="mt-4">
            <input type="hidden" id="agent_index" name="agent_index" value="">
            <input type="hidden" id="agent_name" name="agent_name" value="">

            <!-- From Number -->
            <div class="form-group">
              <label for="from_number">From Number</label>
              <select class="form-control" id="from_number" name="from_number">
                <option value="">Select a number</option>
              </select>
            </div>

            <!-- Prompt Textarea -->
            <div class="form-group">
              <label for="promptTextarea">Prompt</label>
              <textarea style="height: 315px;" class="form-control" id="promptTextarea" name="prompt" placeholder="Describe the main business activities of your company.">{{ data.prompt or '' }}</textarea>
            </div>

            <!-- First Sentence -->
            <div class="form-group">
              <label for="first_sentence">First Sentence</label>
              <input type="text" class="form-control" id="first_sentence" name="first_sentence" placeholder="Enter the first sentence." value="{{ data.first_sentence or '' }}">
            </div>

            <div class="form-group">
              <label for="lang">Language</label>
              <select class="form-control" id="lang" name="lang">
                <option value="bg" {% if data.lang=='bg' %}selected{% endif %}>Bulgarian</option>
                <option value="ca" {% if data.lang=='ca' %}selected{% endif %}>Catalan</option>
                <option value="zh" {% if data.lang=='zh' %}selected{% endif %}>Chinese</option>
                <option value="zh-TW" {% if data.lang=='zh-TW' %}selected{% endif %}>Chinese (Taiwan)</option>
                <option value="zh-HK" {% if data.lang=='zh-HK' %}selected{% endif %}>Chinese (Hong Kong)</option>
                <option value="cs" {% if data.lang=='cs' %}selected{% endif %}>Czech</option>
                <option value="da" {% if data.lang=='da' %}selected{% endif %}>Danish</option>
                <option value="nl" {% if data.lang=='nl' %}selected{% endif %}>Dutch</option>
                <option value="en-US" {% if data.lang=='en-US' %}selected{% endif %}>English (US)</option>
                <option value="en-GB" {% if data.lang=='en-GB' %}selected{% endif %}>English (UK)</option>
                <option value="en-AU" {% if data.lang=='en-AU' %}selected{% endif %}>English (Australia)</option>
                <option value="en-NZ" {% if data.lang=='en-NZ' %}selected{% endif %}>English (New Zealand)</option>
                <option value="en-IN" {% if data.lang=='en-IN' %}selected{% endif %}>English (India)</option>
                <option value="hi" {% if data.lang=='hi' %}selected{% endif %}>Hindi</option>
                <option value="fr" {% if data.lang=='fr' %}selected{% endif %}>French</option>
                <option value="de" {% if data.lang=='de' %}selected{% endif %}>German</option>
                <option value="ja" {% if data.lang=='ja' %}selected{% endif %}>Japanese</option>
                <option value="ko" {% if data.lang=='ko' %}selected{% endif %}>Korean</option>
                <option value="es" {% if data.lang=='es' %}selected{% endif %}>Spanish</option>
                <option value="sv" {% if data.lang=='sv' %}selected{% endif %}>Swedish</option>
                <option value="pt" {% if data.lang=='pt' %}selected{% endif %}>Portuguese</option>
                <option value="it" {% if data.lang=='it' %}selected{% endif %}>Italian</option>
                <option value="ru" {% if data.lang=='ru' %}selected{% endif %}>Russian</option>
                <option value="tr" {% if data.lang=='tr' %}selected{% endif %}>Turkish</option>
                <option value="vi" {% if data.lang=='vi' %}selected{% endif %}>Vietnamese</option>
                <option value="th" {% if data.lang=='th' %}selected{% endif %}>Thai</option>
                <option value="pl" {% if data.lang=='pl' %}selected{% endif %}>Polish</option>
              </select>
            </div>
            

            <!-- Voice + Transfer -->
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="voice">Voice Selection</label>
                <select class="form-control" id="voice" name="voice">
                  <option value="">Select a voice</option>
                </select>
              </div>
              <div class="form-group col-md-6">
                <label for="transfer_number">Transfer Call Number</label>
                <input type="tel" class="form-control" id="transfer_number" name="transfer_number" placeholder="Enter transfer number" value="{{ data.transfer_number or '' }}">
              </div>
            </div>

            <button type="submit" class="btn btn-primary">Update</button>
          </form>

        </div>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", function () {
      // Twilio Numbers
      fetch('https://talk-to-emmy.lexatalk.com/get_twilio_numbers')
        .then(res => res.json())
        .then(data => {
          const dropdown = document.getElementById('from_number');
          dropdown.innerHTML = '<option value="">Select a number</option>';
          data.numbers?.forEach(num => {
            const option = document.createElement('option');
            option.value = num.phone_number;
            option.textContent = num.phone_number;
            dropdown.appendChild(option);
          });
        });

      // Fetch Prompts
      fetch('https://talk-to-emmy.lexatalk.com/fetch_prompts')
        .then(res => res.json())
        .then(prompts => {
          const dropdown = document.getElementById('select_agent');
          dropdown.innerHTML = '<option value="">New Agent</option>';
          prompts.forEach((item, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = item.name;
            option.dataset.prompt = item.prompt;
            dropdown.appendChild(option);
          });

          dropdown.addEventListener('change', function () {
            const selected = this.options[this.selectedIndex];
            document.getElementById('promptTextarea').value = selected.dataset.prompt || "";
            document.getElementById('agent_name').value = selected.textContent || "";
          });
        });

      // Last config
      fetch('/get_recall_data')
        .then(res => res.json())
        .then(data => {
          document.getElementById('promptTextarea').value = data.prompt || "";
          document.getElementById('first_sentence').value = data.first_sentence || "";
          document.getElementById('lang').value = data.lang || "en";
          document.getElementById('voice').value = data.voice || "";
          document.getElementById('transfer_number').value = data.transfer_number || "";
          if (data.from_number)
            document.getElementById('from_number').value = data.from_number;
          if (data.agent_name)
            document.getElementById('agent_name').value = data.agent_name;
        });

      // ElevenLabs Voices
      fetch('https://talk-to-emmy.lexatalk.com/get_elevenlabs_voices')
        .then(res => res.json())
        .then(data => {
          const dropdown = document.getElementById('voice');
          dropdown.innerHTML = '<option value="">Select a voice</option>';
          data.voices?.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.voice_id || voice.id;
            option.textContent = `${voice.name} (${voice.labels?.accent || 'No accent'})`;
            dropdown.appendChild(option);
          });
        });
    });
  </script>
</body>
</html>
