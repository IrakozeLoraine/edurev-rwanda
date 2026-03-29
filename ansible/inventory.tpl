[app_server]
app-vm ansible_host={{ app_host }}

[app_server:vars]
ansible_user={{ app_ssh_user }}
ansible_ssh_private_key_file={{ bastion_key_path }}
ansible_ssh_common_args={{ bastion_proxy_command }}
ansible_python_interpreter=/usr/local/bin/python3.10
